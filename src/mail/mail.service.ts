import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Queue } from 'bull'
import * as ejs from 'ejs'
import { join } from 'path'

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('send-mail') private mailQueue: Queue
  ) {}

  // private getSES() {
  //   const accessKeyId = this.configService.get('mail.username');
  //   const secretAccessKey = this.configService.get('mail.password');
  //   const region = this.configService.get('mail.region');
  //
  //   const credentials = new Credentials({
  //     accessKeyId,
  //     secretAccessKey,
  //   });
  //
  //   return new SES({credentials, region, apiVersion: 'latest'});
  // }

  async sendMail(
    toAddress: string | string[],
    subject: string,
    fileNameTemplate: string,
    data?: ejs.Data
  ) {
    try {
      const messageBody = await ejs.renderFile(
        join(__dirname, `templates/${fileNameTemplate}.ejs`),
        data || {}
      )
      const to = typeof toAddress === 'string' ? [toAddress] : toAddress
      const mailOptions = {
        from: this.configService.get<string>('mail.sendFrom'),
        to,
        subject,
        html: messageBody
      }

      await this.mailQueue.add('sendMail', { mailOptions })

      return true
    } catch (error) {
      console.log(error)
    }
  }
}
