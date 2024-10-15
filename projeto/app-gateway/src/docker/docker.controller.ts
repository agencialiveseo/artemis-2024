import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import { DockerService } from './docker.service';

@Controller()
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @MessagePattern('CRAWLER.REQUEST')
  startCrawler(@Payload() data: number[], @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`, `Data: ${JSON.stringify(data)}`);

    this.dockerService.startNewContainer({
      data
    });
  }

  // Já que não temos como enviar o --rm no startup via Docker API, poderíamos ter aqui, um método para apagar o container, por exemplo.
  // @MessagePattern('CRAWLER.REQUEST.*')
  // stopCrawlerContainer(@Payload() data: number[], @Ctx() context: NatsContext) {
  //   console.log(`Subject: ${context.getSubject()}`, `Data: ${JSON.stringify(data)}`);

  //   // this.dockerService.stopContainer({
  //   //   data
  //   // });
  // }

}
