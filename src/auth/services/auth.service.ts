import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cron, CronExpression } from '@nestjs/schedule'
import { compare, hash } from 'bcrypt'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import moment from 'moment'
import { UserTokenService } from 'src/user-token/user-token.service'
import { LessThan } from 'typeorm'

import MsgHelper from '../../common/MessageUtils'
import { makeId } from '../../common/UserCode'
import { User } from '../../databases/entities/user.entity'
import { UserCode } from '../../databases/entities/user_code.entity'
import { KEY_SETTING } from '../../settings/constants/key_setting'
import { SettingsService } from '../../settings/services/settings.service'
import { AppLogger } from '../../shared/logger/logger.service'
import { RequestContext } from '../../shared/request-context/request-context.dto'
import { TrackingService } from '../../tracking/tracking.service'
import { UserOutput } from '../../user/dtos/user-output.dto'
import { UserRepository } from '../../user/repositories/user.repository'
import { UserService } from '../../user/services/user.service'
import { UserCodeRepository } from '../../user-code/repositories/user-code.repository'
import { OTP_TYPE, STATUS_OTP } from '../../user-otp/constants/UserTypeOTP'
import { UserOtpRepository } from '../../user-otp/repositories/user-otp.repository'
import { UserOtpService } from '../../user-otp/services/user-otp.service'
import { UserWhitelistRepository } from '../../user-whitelist/user-whitelist.repository'
import { ROLE } from '../constants/role.constant'
import { RegisterInput } from '../dtos/auth-register-input.dto'
import { RegisterOutput } from '../dtos/auth-register-output.dto'
import {
  AuthTokenOutput,
  UserAccessTokenClaims
} from '../dtos/auth-token-output.dto'
import { CreatePasswordDto } from '../dtos/create-password.dto'
import { SignupDto } from '../dtos/signup.dto'
import { VerifyUserCodeDto } from '../dtos/verify-user-code.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly settingService: SettingsService,
    private readonly userOtpService: UserOtpService,
    private readonly logger: AppLogger,
    private readonly userRepository: UserRepository,
    private readonly userCodeRepository: UserCodeRepository,
    private readonly userOtpRepository: UserOtpRepository,
    private readonly userTokenService: UserTokenService,
    private readonly trackingService: TrackingService,
    private readonly userWhitelistRepository: UserWhitelistRepository
  ) {
    this.logger.setContext(AuthService.name)
  }

  async validateUser(
    ctx: RequestContext,
    username: string,
    pass: string
  ): Promise<UserAccessTokenClaims> {
    this.logger.log(ctx, `${this.validateUser.name} was called`)

    // The userService will throw Unauthorized in case of invalid username/password.
    const user = await this.userService.validateUsernamePassword(
      ctx,
      username,
      pass
    )

    // Prevent disabled users from logging in.
    if (user.isAccountDisabled) {
      throw new UnauthorizedException('This user account has been disabled')
    }

    return user
  }

  async login(user: User, deviceId = null): Promise<AuthTokenOutput> {
    // const userWhiteList = await this.checkUserWallet(user.email)
    // if (!userWhiteList) {
    //   throw new BadRequestException(MsgHelper.MsgList.email_not_support)
    // }
    const payload = {
      username: user.name,
      sub: user.id,
      roles: user.roles,
      wallet: user.wallet
    }

    const expiredIn =
      new Date().getTime() / 1000 +
      this.configService.get('jwt.accessTokenExpiresInSec')
    const subject = { sub: user.id }
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec')
      }),
      accessToken: this.jwtService.sign(
        {
          ...payload,
          ...subject
        },
        {
          expiresIn: this.configService.get('jwt.accessTokenExpiresInSec')
        }
      )
    }

    const dataUserToken = {
      userId: user.id,
      token: authToken.accessToken,
      expiredIn,
      deviceId
    }

    //check if login another device then cancel sleepTracking
    const latestUserToken = await this.userTokenService.getActiveUserToken(
      user.id
    )
    if (
      latestUserToken &&
      latestUserToken.deviceId &&
      latestUserToken.deviceId !== deviceId
    ) {
      await this.trackingService.forceWakeUpTracking(user.id)
    }

    await this.userTokenService.saveTokenDevice(dataUserToken)

    return plainToClass(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true
    })
  }

  async getUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email)

    if (!user || (user && !user.password)) {
      throw new UnauthorizedException(MsgHelper.MsgList.email_does_not_exist)
    }
    const match = await compare(password, user.password)
    if (!match)
      throw new UnauthorizedException(
        MsgHelper.MsgList.incorrect_email_password
      )

    return user
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userService.findByEmail(email)
    return user
  }

  async register(
    ctx: RequestContext,
    input: RegisterInput
  ): Promise<RegisterOutput> {
    this.logger.log(ctx, `${this.register.name} was called`)

    // TODO : Setting default role as USER here. Will add option to change this later via ADMIN users.
    input.roles = [ROLE.USER]
    input.isAccountDisabled = false

    const registeredUser = await this.userService.createUser(ctx, input)
    return plainToClass(RegisterOutput, registeredUser, {
      excludeExtraneousValues: true
    })
  }

  async refreshToken(
    ctx: RequestContext,
    deviceId: string
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`)

    const user = await this.userService.findById(ctx, ctx.user.id)
    if (!user) {
      throw new UnauthorizedException('Invalid user id')
    }

    return this.getAuthToken(ctx, user, deviceId)
  }

  async getAuthToken(
    ctx: RequestContext,
    user: UserAccessTokenClaims | UserOutput,
    deviceId: string
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.getAuthToken.name} was called`)

    const subject = { sub: user.id }
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      wallet: user.wallet
    }

    const expiredIn =
      new Date().getTime() / 1000 +
      this.configService.get('jwt.accessTokenExpiresInSec')
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec')
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') }
      )
    }

    const dataUserToken = {
      userId: user.id,
      token: authToken.accessToken,
      expiredIn,
      deviceId
    }
    await this.userTokenService.saveTokenDevice(dataUserToken)
    return plainToClass(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true
    })
  }

  async getSettingActiveCode(): Promise<{ isEnable: boolean }> {
    const setting = await this.settingService.getSetting(
      KEY_SETTING.ENABLE_ACTIVE_CODE
    )
    return {
      isEnable: !!parseInt(setting.value)
    }
  }

  async signup(signupDto: SignupDto): Promise<User> {
    // const userWhiteList = await this.checkUserWallet(signupDto.email)
    // if (!userWhiteList) {
    //   throw new BadRequestException(MsgHelper.MsgList.email_not_support)
    // }
    const user = await this.userService.findByEmail(signupDto.email)
    if (user && user.isCreatedPassword) {
      throw new BadRequestException(MsgHelper.MsgList.email_already_exist)
    }
    await this.userOtpService.verifyOtp({
      otp: signupDto.otp,
      email: signupDto.email,
      otpType: OTP_TYPE.SIGN_UP
    })

    if (!user) {
      return this.userRepository.save({
        email: signupDto.email,
        roles: [ROLE.USER],
        isCreatedPassword: false,
        isAccountDisabled: false,
        isNewLetter: signupDto.isNewLetter
      })
    }
    return user
  }

  async verifyUserCode(dto: VerifyUserCodeDto): Promise<string> {
    const userCode = await this.userCodeRepository.findOne({
      where: { code: dto.activeCode }
    })
    if (!userCode || userCode.isUsed) {
      throw new BadRequestException(MsgHelper.MsgList.invalid_code)
    }

    if (new Date().getTime() / 1000 > parseInt(userCode.expired)) {
      throw new BadRequestException(MsgHelper.MsgList.otp_expired)
    }
    return 'Active code is available.'
  }

  async createPassword(dto: CreatePasswordDto): Promise<User> {
    const user = await this.userService.findByEmail(dto.email)
    if (!user) {
      throw new BadRequestException(MsgHelper.MsgList.email_does_not_exist)
    } else if (user && user.isCreatedPassword) {
      throw new BadRequestException(MsgHelper.MsgList.email_already_exist)
    }

    const settingActiveCode = await this.getSettingActiveCode()
    if (settingActiveCode.isEnable) {
      await this.verifyUserCode({ activeCode: dto.activeCode })
    }
    const otpCode = await this.userOtpRepository.findOne({
      where: {
        email: dto.email,
        type: OTP_TYPE.SIGN_UP,
        status: STATUS_OTP.VERIFIED
      },
      order: {
        createdAt: 'DESC'
      }
    })
    const FIVE_MINUTES_IN_SECOND = 300
    if (!otpCode || otpCode.code !== dto.otp) {
      throw new BadRequestException(MsgHelper.MsgList.invalid_code)
    }
    if (
      new Date().getTime() / 1000 >
      otpCode.expiredAt + FIVE_MINUTES_IN_SECOND
    ) {
      throw new BadRequestException(MsgHelper.MsgList.otp_expired)
    }
    const hashedPassword = await hash(dto.password, 10)
    const updatedUSer = await this.userRepository.save({
      ...user,
      password: hashedPassword,
      isCreatedPassword: true
    })
    const activeCode = new UserCode()
    activeCode.userId = updatedUSer.id
    activeCode.code = this._generateActiveCode(updatedUSer.id)
    activeCode.isUsed = false
    await this.userCodeRepository.save(activeCode)
    if (settingActiveCode.isEnable) {
      const userCode = await this.userCodeRepository.findOne({
        where: { code: dto.activeCode }
      })
      await this.userCodeRepository.save({
        id: userCode.id,
        isUsed: true,
        codeUsedAt: Math.floor(new Date().getTime() / 1000).toString()
      })
    }
    const auth = await this.login(user)
    return plainToClass(User, {
      email: updatedUSer.email,
      wallet: updatedUSer.wallet,
      roles: updatedUSer.roles,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken
    })
  }

  private _generateActiveCode(userId): string {
    return makeId() + `${userId}`
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token)
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
