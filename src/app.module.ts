import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CvModule } from './cv/cv.module';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot(), CvModule],
  providers: [AppService],
})
export class AppModule {}
