import { Withdraw } from 'src/databases/entities/withdraw.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(Withdraw)
export class WithdrawRepository extends Repository<Withdraw> {}
