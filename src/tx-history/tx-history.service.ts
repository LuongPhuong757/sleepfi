import { Injectable } from '@nestjs/common'
import _ from 'lodash'
import { TxHistories } from 'src/databases/entities/tx_histories.entity'
import { TRANSACTION_TYPE, WITHDRAW_STATUS } from 'src/withdraw/constants'

import { CreateTxHistoryDto } from '../tx-history/dto/tx-history.dto'
import { ACTION_INSERT_TYPE_DTO, ACTION_TYPE } from './constant'
import { GetTxHistoryDto } from './dto/get-tx-history'
import { ListDepositDto } from './dto/list-deposit.dto';
import { GetListTransaction } from './dto/list-transaction.dto';
import { TxHistoryRepository } from './tx-history.repository'

@Injectable()
export class TxHistorySevice {
  constructor(private readonly txHistoryRepository: TxHistoryRepository) {}

  async insertIntoTxHistory(createTxHistoryDto: CreateTxHistoryDto) {
    try {
      const {
        userId,
        symbol,
        tokenAddress,
        amount,
        tokenId,
        contractAddress,
        tx
      } = createTxHistoryDto
      const txHistory = new TxHistories()
      txHistory.userId = userId
      txHistory.symbol = symbol
      txHistory.tokenAddress = tokenAddress
      txHistory.amount = amount
      txHistory.tokenId = tokenId
      txHistory.contractAddress = contractAddress
      txHistory.tx = tx
      txHistory.type = TRANSACTION_TYPE.DEPOSIT_TOKEN
      txHistory.status = WITHDRAW_STATUS.PENDING
      return await txHistory.save()
    } catch (error) {
      console.log(error)
    }
  }

  addHistory(dto: ACTION_INSERT_TYPE_DTO): Promise<TxHistories> {
    const { userId, symbol, amount, type, tx, metaData } = dto
    return this.txHistoryRepository.save({
      ...dto,
      type,
      userId,
      symbol,
      amount: String(amount),
      status: WITHDRAW_STATUS.SUCCESS,
      metaData: JSON.stringify(metaData),
      tx: tx ?? '0x0000000000000000000000000000000000000000'
    })
  }

  async getPendingTxHistory(userId: number, getTxHistoryDto: GetTxHistoryDto) {
    const { limit, page } = getTxHistoryDto
    const query = await this.txHistoryRepository
      .createQueryBuilder('tx')
      .leftJoinAndSelect('users', 'user', 'user.id = tx.user_id')
      .where('tx.user_id = :userId', { userId })
      .andWhere('tx.status = :status', { status: WITHDRAW_STATUS.PENDING })
      .limit(limit)
      .offset(limit * (page - 1))

    const [list, count] = await Promise.all([query.getMany(), query.getCount()])
    return { list, count }
  }

  async getTxHistory(getTxHistoryDto: GetListTransaction) {
    const { limit, page, email} = getTxHistoryDto
    const query = await this.txHistoryRepository
      .createQueryBuilder('tx')
      .select([
        'tx.user_id as userId',
        'users.email as email',
        'tx.symbol as symbol',
        'tx.token_address as tokenAddress',
        'tx.amount as amount',
        'tx.token_id as tokenId',
        'tx.contract_address as contractAddress',
        'tx.type as type',
        'tx.tx as tx',
        'tx.status as status'
      ])
      .leftJoin('users','users','users.id = tx.user_id')
      .where('users.email = :email', { email })
      .andWhere('tx.status = :status', { status: WITHDRAW_STATUS.SUCCESS })
      .andWhere('tx.type In (:type)', { type: [ACTION_TYPE.DEPOSIT_NFT, ACTION_TYPE.DEPOSIT_TOKEN, ACTION_TYPE.WITHDRAW_NFT, ACTION_TYPE.WITHDRAW_TOKEN] })
      .andWhere('tx.status = :status', { status: WITHDRAW_STATUS.SUCCESS })
      .limit(limit)
      .offset(limit * (page - 1))

    const [list, count] = await Promise.all(
      [
        query.getRawMany(),
        query.getCount()
      ]
    );
    return { list, count }
  }

  async getTxHistoryAllUser(listDepositDto: ListDepositDto) {
    const { limit, page, startDate, endDate } = listDepositDto
    const query = await this.txHistoryRepository
      .createQueryBuilder('tx')
      .select([
        'tx.id as id',
        'tx.userId as userId',
        'tx.tokenAddress as tokenAddress',
        'tx.amount as amount',
        'tx.type as type',
        'tx.tx as tx',
        'tx.status as status',
        'tx.created_at as createdAt'
      ])
      .where('tx.status = :status', { status: WITHDRAW_STATUS.SUCCESS })
      .andWhere('tx.type = :type', { type: ACTION_TYPE.DEPOSIT_TOKEN })
      .limit(limit)
      .offset(limit * (page - 1))

    if (startDate && endDate) {
      const formatStartDate = startDate.toISOString().split('T')
      const formatEndDate = endDate.toISOString().split('T')
      query.andWhere(
        `tx.created_at between '${formatStartDate[0]}' and '${formatEndDate[0]}'`
      )
    }
    const [list, count] = await Promise.all([
      query.getRawMany(),
      query.getCount()
    ])
    return { list, count }
  }
}
