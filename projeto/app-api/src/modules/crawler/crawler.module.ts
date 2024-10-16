import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { NatsModule } from 'src/common/nats/nats.module';
import { SocketModule } from 'src/common/socket/socket.module';

@Module({
  imports: [
    PrismaModule,
    NatsModule,
    SocketModule,
  ],
  
  providers: [CrawlerService],
  controllers: [CrawlerController],
})
export class CrawlerModule {}