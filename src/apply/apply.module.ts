import { Module } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
