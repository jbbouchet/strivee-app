import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '@strivee-api/app.module';
import { TypeormFrenchLocalityEntity, TypeormJobEntity } from '@strivee-api/france-travail/infrastructure/datastore/typeorm';
import { JobImporter, LocalityImporter } from '@strivee-api/france-travail/infrastructure/scripts';
import { Repository } from 'typeorm';

async function importJob(repository: Repository<TypeormJobEntity>): Promise<void> {
  const importer = new JobImporter(repository);
  await importer.import();
}

async function importLocality(repository: Repository<TypeormFrenchLocalityEntity>): Promise<void> {
  const importer = new LocalityImporter(repository);
  await importer.import();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Database/populate');

  logger.log('Starting the import of data into the database.');
  const jobRepository: Repository<TypeormJobEntity> = app.get(getRepositoryToken(TypeormJobEntity));
  const localityRepository: Repository<TypeormFrenchLocalityEntity> = app.get(getRepositoryToken(TypeormFrenchLocalityEntity));

  await importJob(jobRepository);
  await importLocality(localityRepository);
  logger.log('End of data import, no errors occurred.');

  process.kill(process.pid, 'SIGTERM');
}

bootstrap();
