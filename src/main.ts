import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


/**
 * Adds global pipes to the given Nest application.
 *
 * @param app - The Nest application object.
 */
function addGlobalPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: false,
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Application/bootstrap');
  
  addGlobalPipes(app);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('application.port');

  await app.listen(port);

  logger.log(`Application start on port ${port}.`);
}

bootstrap();
