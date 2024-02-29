// import { TxHistories } from 'crawler/entities/TxHistories.entity';
import { TxHistories } from 'src/databases/entities/tx_histories.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(TxHistories)
export class TxHistoryRepository extends Repository<TxHistories> {}
