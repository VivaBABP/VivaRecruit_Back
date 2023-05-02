import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationCode(code: number, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Inscription à VivaRecruit',
      template: './confirmation-code',
      context: {
        code,
      },
    });
  }
}
