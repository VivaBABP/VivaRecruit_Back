import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
