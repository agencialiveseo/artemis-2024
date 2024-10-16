import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions, natsOptions } from './config/general';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS globalmente
  app.enableCors(corsOptions);

  // Configuração do microserviço NATS
  app.connectMicroservice(natsOptions as MicroserviceOptions);

  // Inicia o microserviço NATS para ouvir eventos
  await app.startAllMicroservices();

  // Inicia a escuta na porta http 3000
  await app.listen(3000);
}

bootstrap();
