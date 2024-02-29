import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import MsgHelper from 'src/common/MessageUtils'
import { UserRepository } from 'src/user/repositories/user.repository'

import { MailService } from '../../mail/mail.service'
import { UserWhitelistRepository } from '../../user-whitelist/user-whitelist.repository'
import { OTP_RESPONSE, OTP_TYPE, STATUS_OTP } from '../constants/UserTypeOTP'
import { CreateUserOtpDto } from '../dtos/create-user-otp.dto'
import { VerifyOtpDto } from '../dtos/verify-otp.dto'
import { UserOtpRepository } from '../repositories/user-otp.repository'

@Injectable()
export class UserOtpService {
  constructor(
    private configService: ConfigService,
    private repository: UserOtpRepository,
    private readonly mailService: MailService,
    private readonly userRepo: UserRepository,
    private readonly userWhitelistRepository: UserWhitelistRepository
  ) {}

  async getOTPbyType(userOtpDto: CreateUserOtpDto): Promise<OTP_RESPONSE> {
    if (userOtpDto.otpType === OTP_TYPE.CHANGE_PASS) {
      const user = await this.userRepo.findOne({
        where: {
          email: userOtpDto.email
        }
      })
      if (!user) {
        throw new BadRequestException(MsgHelper.MsgList.email_does_not_exist)
      }
    }

    // const userWhiteList = await this.checkUserWallet(userOtpDto.email)
    // if (!userWhiteList) {
    //   throw new BadRequestException(MsgHelper.MsgList.email_not_support)
    // }
    const code = Math.floor(100000 + Math.random() * 900000)
    const expiredSeconds = this.configService.get<string>('mail.otp_expired')
    const expiredAt =
      Math.round(new Date().getTime() / 1000) + parseInt(expiredSeconds)
    await this.mailService.sendMail(
      userOtpDto.email,
      'OTP CODE FROM SLEEFI',
      'confirmation',
      { code }
    )
    await this.repository.save({
      email: userOtpDto.email,
      code,
      type: userOtpDto.otpType ?? OTP_TYPE.SIGN_UP,
      status: STATUS_OTP.WAIT_VERIFY,
      expiredAt
    })
    return {
      message: 'Sent otp code to email.'
    }
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<string> {
    // if change pass type then need check user exist inside database
    if (dto.otpType === OTP_TYPE.CHANGE_PASS) {
      const hasEmail = await this.userRepo.findOne({
        where: {
          email: dto.email
        }
      })
      if (!hasEmail) {
        throw new BadRequestException(MsgHelper.MsgList.email_does_not_exist)
      }
    }

    const userOtp = await this.repository.findOne({
      where: {
        email: dto.email,
        type: dto.otpType,
        status: STATUS_OTP.WAIT_VERIFY
      },
      order: {
        createdAt: 'DESC'
      }
    })
    if (!userOtp || dto.otp !== userOtp.code) {
      throw new BadRequestException(MsgHelper.MsgList.invalid_code)
    } else if (new Date().getTime() / 1000 > userOtp.expiredAt) {
      throw new BadRequestException(MsgHelper.MsgList.otp_expired)
    }
    await this.repository.save({ id: userOtp.id, status: STATUS_OTP.VERIFIED })
    return 'Success'
  }

  async verifedOtpById(dto: VerifyOtpDto): Promise<string> {
    const userOtp = await this.repository.findOne({
      where: {
        email: dto.email,
        type: dto.otpType,
        status: STATUS_OTP.VERIFIED,
        code: dto.otp
      },
      order: {
        createdAt: 'DESC'
      }
    })

    if (userOtp) {
      return 'Success'
    }
    return 'Fail'
  }

  async checkUserWallet(email: string) {
    const userWL = await this.userWhitelistRepository.findOne({
      where: {
        email: email
      }
    })
    return userWL
  }
}
