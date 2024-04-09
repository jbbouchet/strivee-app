import { Logger } from '@nestjs/common';
import { splitIntoChunks } from '@strivee-api/core/lib';
import { FrenchLocality } from '@strivee-api/france-travail/domain/entities/french-locality';
import { CsvFrenchLocality } from '@strivee-api/france-travail/infrastructure/contract';
import { TypeormFrenchLocalityEntity } from '@strivee-api/france-travail/infrastructure/datastore/typeorm';
import * as csv from 'csv-parser';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { In, Repository } from 'typeorm';

export class LocalityImporter {
  /**
   * Path to the source file.
   */
  private readonly path = 'private/assets/communes.csv';

  /**
   * Logger instance.
   */
  private readonly logger = new Logger(this.constructor.name);

  /**
   * Locality import state.
   * @private
   */
  private state: {
    found: Set<TypeormFrenchLocalityEntity['id']>;
    creation: FrenchLocality[];
    update: TypeormFrenchLocalityEntity[];
  };

  constructor(private readonly repository: Repository<TypeormFrenchLocalityEntity>) {}

  /**
   * Import localities in the database from C.S.V. files.
   */
  public async import(): Promise<void> {
    this.logger.log('Start locality importer');
    await this.importLocalityFromFile();
    this.logger.log('End of locality importer');
  }

  /**
   * Parse csv file and import or update localities in the database.
   * @private
   */
  private async importLocalityFromFile(): Promise<void> {
    this.resetState();

    // Get current entities
    const entities = await this.repository.find();

    // Define function to update stored entities.
    const update = () =>
      this.storeEntities({
        creation: this.state.creation,
        update: this.state.update,
        deletion: entities.map((locality) => locality.id).filter((id) => !this.state.found.has(id)),
      });

    // Parse csv, and update stored entities
    return new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(this.path))
        .pipe(csv({ separator: ';' }))
        .on('data', (data: CsvFrenchLocality) => this.updateStateWithLocality(data, entities))
        .on('error', (error: Error) => reject(error))
        .on('end', () => update().then(() => resolve()));
    });
  }

  /**
   * Verifies if a new locality needs to be created or if an existing one needs to be updated.
   * @param data - A csv row
   * @param currents - Current localities stored in the database.
   * @private
   */
  private updateStateWithLocality(data: CsvFrenchLocality, currents: TypeormFrenchLocalityEntity[]): void {
    const locality = currents.find(
      (entity) => entity.inseeCode === data.code_insee && entity.postalCode === data.code_postal,
    );

    if (locality === undefined) {
      this.state.creation.push({
        name: data.nom,
        postalCode: data.code_postal,
        inseeCode: data.code_insee,
      });
      return;
    }

    this.state.found.add(locality.id);

    if (locality.name !== data.nom) {
      this.state.update.push({ ...locality, name: data.nom });
    }
  }

  /**
   * Create, update or delete entities from the repository.
   * @param options - List of entities to manage.
   * @private
   */
  private async storeEntities(options: {
    creation: FrenchLocality[];
    update: TypeormFrenchLocalityEntity[];
    deletion: Array<TypeormFrenchLocalityEntity['id']>;
  }) {
    await this.repository.query('BEGIN;');

    if (options.creation.length > 0) {
      await Promise.all(splitIntoChunks(options.creation, 1000).map((chunk) => this.repository.save(chunk)));
      this.logger.log(`${options.creation.length} localities created.`);
    }

    if (options.update.length > 0) {
      await Promise.all(splitIntoChunks(options.creation, 1000).map((chunk) => this.repository.save(chunk)));
      this.logger.log(`${options.creation.length} localities updated.`);
    }

    if (options.deletion.length > 0) {
      await this.repository.delete({ id: In(options.deletion) });
      this.logger.log(`${options.creation.length} localities deleted.`);
    }

    await this.repository.query('COMMIT;');
  }

  /**
   * Reset internal state.
   * @private
   */
  private resetState() {
    this.state = {
      found: new Set(),
      creation: [],
      update: [],
    };
  }
}
