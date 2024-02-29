import { BadRequestException, Injectable } from '@nestjs/common'

import { UserRepository } from '../user/repositories/user.repository'
import { UpdateUserWhitelistDto } from './dto/update-user-whitelist.dto'
import { UserWhitelistDto } from './dto/user-whitelist.dto'
import { UserWhitelistRepository } from './user-whitelist.repository'
@Injectable()
export class UserWhitelistSevice {
  constructor(
    private userRepository: UserRepository,
    private readonly userWhitelistRepository: UserWhitelistRepository
  ) {}

  async createUserWhitelist(dto: UserWhitelistDto): Promise<any> {
    try {
      const isExit = await this.userWhitelistRepository.findOne({
        where: {
          email: dto.email
        }
      })
      if (isExit) {
        throw new BadRequestException('already exist email in whitelist')
      }
      await this.userWhitelistRepository.insertUserWhitelist(dto.email)
      return {
        status: 200,
        message: 'success'
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async updateUserWhitelist(dto: UpdateUserWhitelistDto): Promise<any> {
    try {
      const userWL = await this.userWhitelistRepository.findOne({
        where: {
          email: dto.oldEmail
        }
      })
      if (!userWL) {
        throw new BadRequestException('Not found email in whitelist')
      }
      const isExit = await this.userWhitelistRepository.findOne({
        where: {
          email: dto.newEmail
        }
      })
      if (isExit) {
        throw new BadRequestException('already exist email in whitelist')
      }
      userWL.email = dto.newEmail
      await userWL.save()
      return {
        status: 200,
        message: 'success'
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async deleteUserWhitelist(dto: UserWhitelistDto): Promise<any> {
    try {
      const userWL = await this.userWhitelistRepository.findOne({
        where: {
          email: dto.email
        }
      })
      if (!userWL) {
        throw new BadRequestException('Not found email in whitelist')
      }
      await this.userWhitelistRepository.remove(userWL)
      return {
        status: 200,
        message: 'success'
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
