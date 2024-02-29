import { GachaProbConfig } from 'src/databases/entities/gacha_prob_config.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(GachaProbConfig)
export class GachaProbConfigRepository extends Repository<GachaProbConfig> {}
