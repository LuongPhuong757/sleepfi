// import { TxHistories } from 'crawler/entities/TxHistories.entity';
import { UserWhitelist } from 'src/databases/entities/user_whitelist.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(UserWhitelist)
export class UserWhitelistRepository extends Repository<UserWhitelist> {
  async insertUserWhitelist(email: string) {
    const userWhitelist = new UserWhitelist()
    userWhitelist.email = email
    return await userWhitelist.save()
  }
}
