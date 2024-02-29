import { SpendingBalances } from 'src/databases/entities/spending_balances.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(SpendingBalances)
export class SpendingBalancesRepository extends Repository<SpendingBalances> {}
