import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import _ from 'lodash'
import { PaymentHistories } from 'src/databases/entities/payment_histories.entity'
import { PaymentUserInfo } from 'src/databases/entities/payment_user.entity'
import { Connection } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { User } from '../databases/entities/user.entity'
import {
  GiftPayoutStatus,
  MinimumFirstGift,
  SupportedCurrencies
} from './constants/payment.contant'
import { PaymentDto } from './dto/payment.dto'
import { WyreClient } from './wyre-client'

interface IPayout {
  amount?: number
  destAmount?: number
  sourceAmount?: number
  amountIncludeFees?: boolean
  paymentMethod: string
  sourceCurrency: string
  destCurrency: string
  dest: string
  referrerAccountId: string
  country: string
  lockFields: any
}

export interface IPayoutQueue {
  hashId?: string
  email?: string
  orderId?: string
  orderStatus?: string
  userId?: number | null
  reservation?: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
  amount?: number | null
  wallet?: string
}

@Injectable()
export class PaymentService {
  constructor(
    private readonly wyreClient: WyreClient,
    private readonly connection: Connection,
    @InjectQueue('payment') private paymentQue: Queue
  ) { }

  public async widgetCheckout(dto: PaymentDto) {
    const bodyRequest: IPayout = {
      amount: dto.sourceAmount,
      sourceCurrency: dto.sourceCurrency,
      dest: dto.dest,
      destCurrency: dto.destCurrency,
      referrerAccountId: this.wyreClient.account,
      paymentMethod: this.wyreClient.paymentMethod,
      country: dto.country,
      lockFields: [
        'amount',
        'sourceCurrency',
        'destCurrency',
        'dest',
        'paymentMethod'
      ]
    }
    return await this.wyreClient.post('v3/orders/reserve', bodyRequest)
  }

  public async registerWebhook(webhookURL: string) {
    return await this.wyreClient.post(
      'v2/digitalwallet/webhook',
      {},
      {
        owner: this.wyreClient.account,
        webhook: webhookURL
      }
    )
  }

  public async deleteWebhook(key: string) {
    return await this.wyreClient.delete(`v2/digitalwallet/webhook/${key}`)
  }

  public async getWebhook() {
    return await this.wyreClient.get(`v3/subscriptions`)
  }

  public async getSupportedCountries() {
    const resultData = await this.wyreClient.get('v3/widget/supportedCountries')
    const countries = resultData.data
    return {
      status: 'success',
      data: {
        countries: countries,
        fiats: SupportedCurrencies
      }
    }
  }

  public async payoutWebhook(dto: any) {
    // is valid data
    if (!dto || _.isEmpty(dto)) return false

    // add histories transaction
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      // add history
      const history = new PaymentHistories()
      history.hashId = uuidv4()
      history.email = dto?.email
      history.orderId = dto?.orderId
      history.orderStatus = dto?.orderStatus
      history.transferId = dto?.transferId
      history.reservation = dto?.reservation
      history.resultInfo = JSON.stringify(dto)
      history.createdAt = new Date()
      history.updatedAt = new Date()
      await queryRunner.manager.save(history)

      // gift for payout first and map user id and gift for payment
      if (dto?.orderStatus === 'COMPLETE') {
        const userMap = await queryRunner.manager.getRepository(User).findOne({
          email: dto?.email
        })

        console.log(`userMap`, userMap)
        const isFirstPayout = await queryRunner.manager
          .getRepository(PaymentUserInfo)
          .findOne({
            userId: userMap?.id
          })

        // if first payout then send 1$ AVAX for user
        if (!isFirstPayout) {
          const orderData = await this.getFullOrderId(dto?.orderId)
          const isSendAVAX =
            orderData?.data?.sourceAmount >= MinimumFirstGift.amount
          const userPayment: IPayoutQueue = {
            hashId: uuidv4(),
            email: dto?.email,
            orderId: dto?.orderId,
            orderStatus: dto?.orderStatus,
            userId: userMap ? userMap?.id : null,
            reservation: dto?.reservation,
            status: isSendAVAX ? GiftPayoutStatus.NEW : GiftPayoutStatus.DONE,
            createdAt: new Date(),
            updatedAt: new Date(),
            amount: orderData?.data?.sourceAmount || 0,
            wallet: userMap?.wallet ?? ''
          }
          await queryRunner.manager
            .getRepository(PaymentUserInfo)
            .save(userPayment)
          if (isSendAVAX) {
            this.paymentQue.add('send-avax-payout', userPayment)
          }
        }
      }

      await queryRunner.commitTransaction()
      return true
    } catch (error) {
      console.log(`PaymentService - payoutWebhook ${JSON.stringify(error)}`)
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  public async getFullOrderId(orderId: string) {
    return await this.wyreClient.get(`v3/orders/${orderId}/full`, {}, {})
  }
}
