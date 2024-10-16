import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NatsService } from 'src/common/nats/nats.service';
import { Crawler, CrawlerStatus } from '@prisma/client';
import { SocketGateway } from 'src/common/socket/socket.gateway';
import { CrawlerList, CrawlerStart, CrawlerStatusUpdate } from './crawler.types';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly nats: NatsService,
    private readonly socketGateway: SocketGateway
  ) {}

  async requestData({url, userId} : CrawlerStart) : Promise<Crawler> {
    const crawler = await this.prisma.crawler.create({
      data: { 
        url, 
        status: "PENDING", 
        user_id: userId 
      },
    });

    // Envia evento para o NATS
    this.nats.publish('CRAWLER.REQUEST', { url, id: crawler.id });
    return crawler;
  }

  async getAllCrawlers({ userId } : { userId: number }) : Promise<CrawlerList[]> {
    return this.prisma.crawler.findMany({ 
      where: { 
        user_id: userId
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        url: true
      },
    });
  }
  
  async getCrawlerDetails({ id } : { id: number } ) : Promise<Crawler> {
    return this.prisma.crawler.findUnique({
      where: { 
        id
      } 
    });
  }

  async deleteCrawler({ id } : { id: number}) : Promise<Crawler> {
    return this.prisma.crawler.delete({ 
      where: { 
        id
      } 
    });
  }

  async parseCrawlerStatus({ topic, data } : CrawlerStatusUpdate) : Promise<void> {
    console.log('Mensagem NATS recebida no tópico:', topic);
    console.log('Dados recebidos:', data);

    const { id, extractedData } = data;
    // pega o último item do tópico para saber o status
    const status = topic.split('.').pop() as CrawlerStatus;

    // Atualiza o status do Crawler
    await this.prisma.crawler.update({
      where: { id },
      data: { 
        status,
        data: extractedData.data.title
      },
    });

    const crawler = await this.getCrawlerDetails({ id: data.id });
    if(!crawler) {
      return;
    }

    await this.socketGateway.sendMessage(crawler.user_id, "CRAWLER.UPDATE", {id, status});
  }
}
