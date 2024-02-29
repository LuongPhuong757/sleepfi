import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailService } from 'src/mail/mail.service'

import { PaymentControler } from './payment.controller'
import { PaymentRepository } from './payment.repository'
import { PaymentService } from './payment.service'
import { PaymentConsumer } from './queue/payment.consumer'
import { WyreClient } from './wyre-client'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payment'
    }),
    BullModule.registerQueue({
      name: 'send-mail'
    }),
    TypeOrmModule.forFeature([PaymentRepository])
  ],
  controllers: [PaymentControler],
  providers: [
    ConfigService,
    PaymentService,
    WyreClient,
    PaymentConsumer,
    MailService
  ],
  exports: [PaymentService]
})
export class PaymentModule {}
