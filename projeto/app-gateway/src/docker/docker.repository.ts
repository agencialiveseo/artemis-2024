import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

type dockerCreateResponse = {
  Id: string;
  Warnings: string[];
}

@Injectable()
export class DockerRepository {
  private docker: AxiosInstance;

  constructor() {
    this.docker = axios.create({
      baseURL: process.env.DOCKER_API_URL,
    });
  }

  async startContainer({ data } : { data: object }): Promise<void> {
    try {
      const dockerCreate = await this.createContainer({ data });
      await this.docker.post(`/containers/${dockerCreate.Id}/start`);
    } catch (error) {
      console.error(`Erro ao iniciar o container:`, error);
      throw error;
    }
  }
  
  private async createContainer({ data } : { data: object }): Promise<dockerCreateResponse> {
    try {
      // gera um id "único" para uso no nome do container
      const uniqId = Math.random().toString(36).substring(7);

      const dockerCreate : dockerCreateResponse = (
        await this.docker.post(`/containers/create?name=app-crawler-${uniqId}`, this.getDockerCreateObject({ data}))
      ).data;

      if(dockerCreate.Warnings.length > 0) {
        console.log(`Warnings ao criar o container ${uniqId}:`, dockerCreate.Warnings);
      }

      return dockerCreate;
    } catch (error) {
      console.error(`Erro ao criar o container:`, error);
      throw error;
    }
  }

  async stopContainer({ data } : { data: object }): Promise<void> {
    try {
      console.log("Função ainda não implementada para Docker local.", data);
    } catch (error) {
      console.error(`Erro ao deletar o container:`, error);
      throw error;
    }
  }
  
  private getDockerCreateObject({ data } : { data: object }): object {
    return {
      Image: 'app-crawler',
      Env: [
        'CRAWLER_CONFIG=' + JSON.stringify(data),
        'NATS_SERVERS=' + process.env.NATS_SERVERS,
      ],
      HostConfig: {
        NetworkMode: 'projeto_artemis',
      }
    };
  }
}