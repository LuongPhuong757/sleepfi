import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { ROLE } from '../../auth/constants/role.constant'
import { Roles } from '../../auth/decorators/role.decorator'
import { UserScope } from '../../auth/decorators/user.decorator'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { User } from '../../databases/entities/user.entity'
import { UserCode } from '../../databases/entities/user_code.entity'
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse
} from '../../shared/dtos/base-api-response.dto'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { AppLogger } from '../../shared/logger/logger.service'
import { ReqContext } from '../../shared/request-context/req-context.decorator'
import { RequestContext } from '../../shared/request-context/request-context.dto'
import { ChangeEmailDto } from '../dtos/change-email.dto'
import { ChangePasswordDto } from '../dtos/change-password.dto'
import { ForgotPasswordDto } from '../dtos/forgot-password.dto'
import { GetUserBalanceInput } from '../dtos/get-user-balance.dto'
import { UpdateUser } from '../dtos/update-user.dto'
import { UserOutput } from '../dtos/user-output.dto'
import { VerifyInput } from '../dtos/verify-input.dto'
import { UserService } from '../services/user.service'

@ApiTags('users')
@Controller('users')
@ApiGlobalHeaders()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(UserController.name)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({
    summary: 'Get user me API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput)
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async getMyProfile(
    @ReqContext() ctx: RequestContext
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.getMyProfile.name} was called`)

    const user = await this.userService.findById(ctx, ctx.user.id)
    return { data: user, meta: {} }
  }

  @Get('active-code')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get activation code'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserCode])
  })
  async getActivationCode(
    @ReqContext() ctx: RequestContext
  ): Promise<BaseApiResponse<UserCode[]>> {
    const data = await this.userService.getActivationCode(ctx)
    return {
      data,
      meta: {}
    }
  }

  @Get('balances')
  @ApiOperation({
    summary: 'Get balances API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  async getUserBalance(
    @ReqContext() ctx: RequestContext,
    @Query() credential: GetUserBalanceInput
  ) {
    this.logger.log(ctx, `${this.getUserBalance.name} was called`)
    return await this.userService.getUserBalance(credential.userId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('get-global-config')
  @ApiOperation({
    summary: 'Get global config API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  async getGlobalConfig(@ReqContext() ctx: RequestContext) {
    this.logger.log(ctx, `${this.getGlobalConfig.name} was called`)
    return await this.userService.getGlobalConfig()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users as a list API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserOutput])
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  async getUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto
  ): Promise<BaseApiResponse<UserOutput[]>> {
    this.logger.log(ctx, `${this.getUsers.name} was called`)

    const { users, count } = await this.userService.getUsers(
      ctx,
      query.limit,
      query.offset
    )

    return { data: users, meta: { count } }
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use GET /me
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput)
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse
  })
  async getUser(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.getUser.name} was called`)

    const user = await this.userService.getUserById(ctx, id)
    return { data: user, meta: {} }
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use PATCH /me
  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'Update user API',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse(UserOutput),
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   type: BaseApiErrorResponse,
  // })
  // @UseInterceptors(ClassSerializerInterceptor)
  // async updateUser(
  //   @ReqContext() ctx: RequestContext,
  //   @Param('id') userId: number,
  //   @Body() input: UpdateUserInput,
  // ): Promise<BaseApiResponse<UserOutput>> {
  //   this.logger.log(ctx, `${this.updateUser.name} was called`);
  //   const user = await this.userService.updateUser(ctx, userId, input);
  //   return { data: user, meta: {} };
  // }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('insert-wallet')
  @ApiOperation({
    summary: 'Insert Wallet API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput)
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async insertWallet(
    @ReqContext() ctx: RequestContext,
    @Body() input: VerifyInput,
    @UserScope() user: User
  ) {
    this.logger.log(ctx, `${this.insertWallet.name} was called`)
    const { signedMessage, signer } = input
    return await this.userService.verifyWallet(
      signedMessage,
      signer.toLowerCase(),
      user
    )
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('verify')
  @ApiOperation({
    summary: 'verify Wallet API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput)
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async verifyWallet(
    @ReqContext() ctx: RequestContext,
    @Body() input: VerifyInput,
    @UserScope() user: User
  ) {
    const { signedMessage, signer } = input
    return await this.userService.verifyWalletAddress(
      user,
      signedMessage,
      signer.toLowerCase()
    )
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Put('update')
  @ApiOperation({
    summary: 'update infor user'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput)
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async updateUser(@Body() input: UpdateUser, @UserScope() user: User) {
    return await this.userService.updateUser(user, input)
  }

  @ApiOperation({
    summary: 'change-password in case forgot password'
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('change-password')
  async changePassword(@Body() body: ForgotPasswordDto) {
    return await this.userService.forgotPassword(body)
  }

  @ApiOperation({
    summary: 'update-password'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserOutput
  })
  @Put('update-password')
  forgotPassword(
    @Body() dto: ChangePasswordDto,
    @ReqContext() ctx: RequestContext
  ): Promise<UserOutput> {
    return this.userService.changePassword(dto, ctx.user.id)
  }

  @ApiOperation({
    summary: 'update email for user'
  })
  @ApiBearerAuth()
  @Put('/change-email')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserOutput
  })
  changeEmail(
    @Body() dto: ChangeEmailDto,
    @ReqContext() ctx: RequestContext
  ): Promise<UserOutput> {
    return this.userService.updateUserEmail(dto, ctx.user.id)
  }
}
