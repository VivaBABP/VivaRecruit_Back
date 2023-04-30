import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot(), JobsModule],
  providers: [AppService],
})
export class AppModule {}
