import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      name: 'app-gateway',
      servers: process.env.NATS_SERVERS.split(','),
    },
  });
  
  await app.listen();
}
bootstrap();
