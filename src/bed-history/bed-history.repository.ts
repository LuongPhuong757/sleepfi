import { BedHistory } from 'src/databases/entities/bed_history.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(BedHistory)
export class BedHistoryRepository extends Repository<BedHistory> {}
