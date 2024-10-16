import { Controller, Post, Get, Delete, Param, Body, Req } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';

@Controller('crawler')
export class CrawlerController {
  constructor(
    private readonly crawlerService: CrawlerService
  ) {}

  @Post()
  async requestData(@Body() data: { url: string }, @Req() req) {
    return await this.crawlerService.requestData({
      url: data.url,
      userId: req.userId
    });
  }

  @Get()
  async getAll(@Req() req) {
    return await this.crawlerService.getAllCrawlers({ 
      userId: req?.userId
    });
  }

  @Get(':id')
  async getDetails(@Param('id') id: string, @Req() req) {
    return await this.crawlerService.getCrawlerDetails({ 
      id: +id 
    });
  }

  @Delete(':id')
  async deleteCrawler(@Param('id') id: string, @Req() req) {
    return await this.crawlerService.deleteCrawler({
      id: +id
    });
  }

  // Escuta mensagens NATS no padrão CRAWLER.REQUEST.*
  @MessagePattern('CRAWLER.REQUEST.*')
  async CrawlerRequestResponse(@Payload() data: any, @Ctx() context: NatsContext) {
    // Obtém o tópico NATS que disparou a mensagem Ex.: CRAWLER.REQUEST.DONE
    const topic = context.getSubject(); 

    await this.crawlerService.parseCrawlerStatus({ topic, data });
  }
}
