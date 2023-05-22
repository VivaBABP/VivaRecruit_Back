import { Module } from '@nestjs/common';
import { PanelService } from './panel.service';
import { PanelController } from './panel.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule {}
