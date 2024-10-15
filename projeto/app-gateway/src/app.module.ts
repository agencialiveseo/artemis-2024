import { Module } from '@nestjs/common';
import { DockerModule } from './docker/docker.module';

@Module({
  imports: [DockerModule],
  providers: [],
})
export class AppModule {}
