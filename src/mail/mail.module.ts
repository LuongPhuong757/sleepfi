import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MailConsumer } from './mail.consumer'
import { MailService } from './mail.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail'
    })
  ],
  providers: [MailService, ConfigService, MailConsumer],
  exports: [MailService]
})
export class MailModule {}
