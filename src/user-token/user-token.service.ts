import { Injectable } from '@nestjs/common'

import { UserToken } from '../databases/entities/user_token.entity'
import { SaveTokenDto } from './dtos/save-token.dto'
import { UserTokenRepository } from './user-token.repository'

@Injectable()
export class UserTokenService {
  constructor(private readonly userTokenRepository: UserTokenRepository) {}

  async saveTokenDevice(data: SaveTokenDto) {
    const { userId, token, expiredIn, deviceId } = data
    const newUserToken = this.userTokenRepository.create({
      userId,
      token,
      expiredIn,
      deviceId,
      isValid: true
    })
    await this.userTokenRepository.update(
      {
        userId,
        isValid: true
      },
      {
        isValid: false
      }
    )
    await this.userTokenRepository.insert(newUserToken)
  }

  getActiveUserToken(userId: number): Promise<UserToken> | null {
    return this.userTokenRepository.findOne({
      where: {
        userId,
        isValid: true
      },
      order: {
        createdAt: 'DESC'
      }
    })
  }
}
