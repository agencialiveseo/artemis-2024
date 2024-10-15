import { Injectable } from '@nestjs/common';
import { DockerRepository } from './docker.repository';

@Injectable()
export class DockerService {
  constructor(private readonly dockerRepository: DockerRepository) {}

  async startNewContainer({ data } : { data: object }): Promise<void> {
    return this.dockerRepository.startContainer({ data });
  }

  async stopContainer({ data } : { data: object }): Promise<void> {
    return this.dockerRepository.stopContainer({ data });
  }

}
