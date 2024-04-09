import { Logger } from '@nestjs/common';
import { splitIntoChunks } from '@strivee-api/core/lib';
import { Job } from '@strivee-api/france-travail';
import { CsvJobRow } from '@strivee-api/france-travail/infrastructure/contract';
import { TypeormJobEntity } from '@strivee-api/france-travail/infrastructure/datastore/typeorm';
import * as csv from 'csv-parser';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { In, Repository } from 'typeorm';

export class JobImporter {
  /**
   * Path to the source file.
   */
  private readonly path = 'private/assets/rome-job.csv';

  /**
   * Logger instance.
   */
  private readonly logger = new Logger(this.constructor.name);

  /**
   * Job import state.
   * @private
   */
  private state: {
    found: Set<TypeormJobEntity['id']>;
    creation: Job[];
    update: TypeormJobEntity[];
  };

  constructor(private readonly repository: Repository<TypeormJobEntity>) {}

  /**
   * Import localities in the database from C.S.V. files.
   */
  public async import(): Promise<void> {
    this.logger.log('Start job importer');
    await this.importJobFromFile();
    this.logger.log('End of job importer');
  }

  public async importJobFromFile(): Promise<void> {
    this.resetState();

    const { entities, dictionary } = await this.getEntities();

    const update = () =>
      this.storeEntities({
        creation: this.state.creation,
        update: this.state.update,
        deletion: entities.map((job) => job.id).filter((id) => !this.state.found.has(id)),
      });
    return new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(this.path))
        .pipe(csv())
        .on('data', (data: CsvJobRow) => this.updateStateWithJob(data, dictionary))
        .on('error', (error: Error) => reject(error))
        .on('end', () => update().then(() => resolve()));
    });
  }

  /**
   * Verifies if a new job needs to be created or if an existing one needs to be updated.
   * @param data - the csv row.
   * @param entities - the current entity dictionary.
   * @private
   */
  private updateStateWithJob(data: CsvJobRow, entities: Record<TypeormJobEntity['label'], TypeormJobEntity>): void {
    const job = entities[data.libelle_appellation_long];

    if (job === undefined) {
      this.state.creation.push({
        label: data.libelle_appellation_long,
        code: data.code_rome,
      });
    } else {
      this.state.found.add(job.id);

      if (job.code !== data.code_rome) {
        this.state.update.push({ ...job, code: data.code_rome });
      }
    }
  }

  /**
   * Create, update or delete entities from the repository.
   * @param options - List of entities to manage.
   * @private
   */
  private async storeEntities(options: {
    creation: Job[];
    update: TypeormJobEntity[];
    deletion: Array<TypeormJobEntity['id']>;
  }) {
    await this.repository.query('BEGIN;');

    if (options.creation.length > 0) {
      await Promise.all(splitIntoChunks(options.creation, 1000).map((chunk) => this.repository.save(chunk)));
      this.logger.log(`${options.creation.length} jobs created.`);
    }

    if (options.update.length > 0) {
      await Promise.all(splitIntoChunks(options.creation, 1000).map((chunk) => this.repository.save(chunk)));
      this.logger.log(`${options.creation.length} jobs updated.`);
    }

    if (options.deletion.length > 0) {
      await this.repository.delete({ id: In(options.deletion) });
      this.logger.log(`${options.creation.length} jobs deleted.`);
    }

    await this.repository.query('COMMIT;');
  }

  /**
   * Get job entities from the database.
   * @private
   */
  private async getEntities(): Promise<{
    entities: TypeormJobEntity[];
    dictionary: Record<TypeormJobEntity['label'], TypeormJobEntity>;
  }> {
    const entities = await this.repository.find();
    const dictionary: Record<string, TypeormJobEntity> = entities
      .map((job) => ({ [job.label]: job }))
      .reduce((a, b) => ({ ...a, ...b }), {});

    return { entities, dictionary };
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
