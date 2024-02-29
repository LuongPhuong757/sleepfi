import { UserGachaInfo } from 'src/databases/entities/user_gacha_info.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(UserGachaInfo)
export class UserGachaInfoRepository extends Repository<UserGachaInfo> {}
