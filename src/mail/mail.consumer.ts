import { Process, Processor } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { Job } from 'bull'
import * as nodemailer from 'nodemailer'

@Processor('send-mail')
export class MailConsumer {
  private transporter

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      pool: true,
      secure: true,
      auth: {
        user: this.configService.get<string>('mail.username'),
        pass: this.configService.get<string>('mail.password')
      }
    })
  }

  @Process('sendMail')
  async sendMail(job: Job<{ mailOptions: any }>) {
    await this.transporter.sendMail(job.data.mailOptions)
    return true
  }
}
