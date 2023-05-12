import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../jwt/strategies/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [CvController],
  providers: [CvService, JwtStrategy],
})
export class CvModule {}
