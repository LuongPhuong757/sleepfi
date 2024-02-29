import { HealthAppData } from 'src/databases/entities/health-app-data.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(HealthAppData)
export class HealthAppDataRepository extends Repository<HealthAppData> {}
