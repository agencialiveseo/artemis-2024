import { Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { DockerController } from './docker.controller';
import { DockerRepository } from './docker.repository';

@Module({
  controllers: [DockerController],
  providers: [DockerService, DockerRepository],
})
export class DockerModule {}
