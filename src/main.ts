import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, Options, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port
      }
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  logger.log(`App Running on port: ${envs.port}`)
  await app.listen();
}
bootstrap();
