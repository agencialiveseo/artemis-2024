import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AccountMiddleware } from './account.middleware';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccountMiddleware)
      .exclude(
        'account/login',
        'account/register',
      )
      .forRoutes('*');
  }
}
