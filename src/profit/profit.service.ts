import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import BigNumber from 'bignumber.js';
import { ProfitHistory } from 'src/databases/entities/profit_history.entity';
import { ProfitWallet } from 'src/databases/entities/profit_wallet.entity';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ProfitSevice {
  constructor(
    private readonly connection: Connection,
  ) { }

  async processProfit(userId: number, symbol: string, amount: string, type: string, manager: EntityManager) {
    if (parseInt(amount) < 0) amount = '0'

    await this.plusAmout(amount, symbol, manager)

    // Insert new ProfitHistory
    const profitHistory = new ProfitHistory()
    profitHistory.type = type;
    profitHistory.amount = amount;
    profitHistory.userId = userId;
    profitHistory.symbol = symbol;

    await manager.getRepository(ProfitHistory).save(profitHistory)
  }

  async plusAmout(amount: string, symbol: string, manager: EntityManager) {
    const profitWallet = await manager.getRepository(ProfitWallet).findOne({ symbol })
    if (!profitWallet) {
      throw new UnauthorizedException('Profit Wallet not found')
    }
    return await manager
      .createQueryBuilder()
      .update(ProfitWallet)
      .set({
        availableAmount: () => `available_amount + ${amount}`,
        amount: () => `amount + ${amount}`
      })
      .where('symbol = :symbol', { symbol })
      .execute()
  }
}
