import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
import { CvModule } from './cv/cv.module';
import { AccountsModule } from './accounts/accounts.module';
import { InterestModule } from './interest/interest.module';
import { PanelModule } from './panel/panel.module';
import { CompanyModule } from './company/company.module';
import { CompanyTypeModule } from './company-type/company-type.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot(),
    MailModule,
    ScheduleModule.forRoot(),
    JobsModule,
    CvModule,
    AccountsModule,
    InterestModule,
    PanelModule,
    CompanyModule,
    CompanyTypeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
