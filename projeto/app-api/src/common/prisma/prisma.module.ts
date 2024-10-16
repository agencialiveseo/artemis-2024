import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() // Torna o módulo global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}