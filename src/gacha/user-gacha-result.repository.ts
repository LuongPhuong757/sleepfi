import { UserGachaResult } from 'src/databases/entities/user_gacha_result.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(UserGachaResult)
export class GachaResultRepository extends Repository<UserGachaResult> {}
