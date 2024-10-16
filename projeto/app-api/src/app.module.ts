import { Module } from '@nestjs/common';
import { SocketModule } from './common/socket/socket.module';
import { AccountModule } from './modules/account/account.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SocketModule, 
    AccountModule, 
    CrawlerModule, 
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ]
})
export class AppModule {}
