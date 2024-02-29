import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { User } from '../../databases/entities/user.entity'
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse
} from '../../shared/dtos/base-api-response.dto'
import { AppLogger } from '../../shared/logger/logger.service'
import { ReqContext } from '../../shared/request-context/req-context.decorator'
import { RequestContext } from '../../shared/request-context/request-context.dto'
import { LoginInput } from '../dtos/auth-login-input.dto'
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto'
import { AuthTokenOutput } from '../dtos/auth-token-output.dto'
import { CreatePasswordDto } from '../dtos/create-password.dto'
import { SignupDto } from '../dtos/signup.dto'
import { VerifyUserCodeDto } from '../dtos/verify-user-code.dto'
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard'
import { MobileVersionGuard } from '../guards/mobile.version'
import { AuthService } from '../services/auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(AuthController.name)
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput)
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse
  })
  @ApiGlobalHeaders()
  @UseGuards(MobileVersionGuard)
  async loginExternalWallet(
    @Body() credential: LoginInput,
    @Headers() headers
  ): Promise<BaseApiResponse<any>> {
    const user = await this.authService.getUser(
      credential.email,
      credential.password
    )

    const authToken = await this.authService.login(user, headers['Device-Id'])
    return { data: { ...authToken, user }, meta: {} }
  }

  @Post('signup')
  @ApiOperation({
    summary: 'User signup first step API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(User)
  })
  async signupFirstStep(
    @Body() dto: SignupDto
  ): Promise<BaseApiResponse<User>> {
    const registeredUser = await this.authService.signup(dto)
    return { data: registeredUser, meta: {} }
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput)
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    @Headers() headers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`)

    const authToken = await this.authService.refreshToken(
      ctx,
      headers['Device-Id']
    )
    return { data: authToken, meta: {} }
  }

  @Get('setting-active-code')
  @ApiOperation({
    summary: 'get setting for active code register'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse
  })
  async getSettingActiveCode(): Promise<
    BaseApiResponse<{ isEnable: boolean }>
  > {
    const setting = await this.authService.getSettingActiveCode()
    return {
      data: setting,
      meta: {}
    }
  }

  @Get('verify-active-code')
  @ApiOperation({
    summary: 'Verify active code is available or not'
  })
  async verifyUserCode(
    @Query() dto: VerifyUserCodeDto
  ): Promise<BaseApiResponse<string>> {
    const message = await this.authService.verifyUserCode(dto)
    return {
      data: message,
      meta: {}
    }
  }

  @Post('create-password-step')
  @ApiOperation({
    summary: 'Create password in final step signup.'
  })
  async createPassword(
    @Body() dto: CreatePasswordDto
  ): Promise<BaseApiResponse<User>> {
    const user = await this.authService.createPassword(dto)
    return {
      data: user,
      meta: {}
    }
  }
}
