import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
import { CvModule } from './cv/cv.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot(),
    MailModule,
    ScheduleModule.forRoot(),
    JobsModule,
    CvModule,
  ],
})
export class AppModule {}
