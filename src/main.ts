import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
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

/**
 * Start the Swagger documentation when the application is started in a "development" environment/
 * @param app - The Nest application object.
 * @param config - The config service
 */
function addOpenApiDocumentation(app: INestApplication<any>, config: ConfigService) {
  const env = config.get('application.env');

  if (env === 'development') {
    const config = new DocumentBuilder().setTitle('Strivee test').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }
}

/**
 * Add security middlewares
 * @param app  - The Nest application object.
 */
function addSecurity(app: INestApplication) {
  app.use(helmet());
}

/**
 * Create a new application and listen on port defined in configuration.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Application/bootstrap');
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('application.port');

  addSecurity(app);
  addGlobalPipes(app);
  addOpenApiDocumentation(app, config);

  await app.listen(port);

  logger.log(`Application start on port ${port}.`);
}

bootstrap();
