import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { MailService } from 'src/mail/mail.service'

import { MinimumFirstGift } from '../constants/payment.contant'
import { IPayoutQueue, PaymentService } from '../payment.service'

@Processor('payment')
export class PaymentConsumer {
  constructor(
    private readonly paymenService: PaymentService,
    private readonly mailService: MailService
  ) {}

  @Process('send-avax-payout')
  async sendAvax(job: Job<{ dataOptions: any }>) {
    console.log(`Begin - PaymentConsumer - sendAvax ${JSON.stringify(job)}`)
    try {
      const data: any = job?.data
      if (!data || !data?.orderId || !data?.amount) return

      const usdc = 0
      const avax = 0

      // if sourceAmount > MinimumFirstGift.amount then
      const amount = Number(
        process.env.APPLE_PAY_MIN_AMOUNT || MinimumFirstGift.amount
      )
      if (data?.amount >= amount) {
        // TODO send AVAX

        await this.mailService.sendMail(
          data.email,
          'Payment Email From SLEEFI',
          'payment',
          { usdc, avax }
        )
      }
    } catch (error) {
      console.log(`Error - PaymentConsumer - sendAvax ${error}`)
    } finally {
      console.log(`End - PaymentConsumer - sendAvax`)
    }
  }
}
