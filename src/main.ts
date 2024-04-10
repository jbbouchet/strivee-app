import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

function addOpenApiDocumentation(app: INestApplication<any>, config: ConfigService) {
  const env = config.get('application.env');

  if (env === 'development') {
    const config = new DocumentBuilder().setTitle('Strivee test').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Application/bootstrap');

  addGlobalPipes(app);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('application.port');

  addOpenApiDocumentation(app, config);

  await app.listen(port);

  logger.log(`Application start on port ${port}.`);
}

bootstrap();
