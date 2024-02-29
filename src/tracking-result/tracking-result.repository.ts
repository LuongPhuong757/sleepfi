import { TrackingResult } from 'src/databases/entities/tracking-result.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(TrackingResult)
export class TrackingResultRepository extends Repository<TrackingResult> {}
