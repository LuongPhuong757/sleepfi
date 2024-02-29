import { UserToken } from 'src/databases/entities/user_token.entity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {}
