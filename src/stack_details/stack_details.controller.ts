import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
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
import { UserScope } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'
import {
  BaseApiErrorResponse,
  BaseApiResponse
} from 'src/shared/dtos/base-api-response.dto'
import { AppLogger } from 'src/shared/logger/logger.service'
import { ReqContext } from 'src/shared/request-context/req-context.decorator'
import { RequestContext } from 'src/shared/request-context/request-context.dto'
import { UserController } from 'src/user/controllers/user.controller'
import { UserOutput } from 'src/user/dtos/user-output.dto'

import { User } from '../databases/entities/user.entity'
import { AddStakingInput } from './dtos/add-staking.dto'
import { StackingInput } from './dtos/stack-input.dto'
import { StackDetailsService } from './stack_details.service'

@ApiTags('stacking')
@Controller('stacking')
@ApiGlobalHeaders()
export class StackDetailsController {
  constructor(
    private readonly stakeDetailsService: StackDetailsService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(UserController.name)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('add-staking')
  @ApiOperation({
    summary: 'add Stacking API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async addStaking(@UserScope() user: User, @Body() payload: AddStakingInput) {
    return await this.stakeDetailsService.addStaking(user, payload)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('compound')
  @ApiOperation({
    summary: 'Compound API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async compound(@ReqContext() ctx: RequestContext, @UserScope() user: User) {
    return this.stakeDetailsService.compound(user.id)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('unstacking')
  @ApiOperation({
    summary: 'Un Stacking API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async unStacking(@UserScope() user: User) {
    return await this.stakeDetailsService.unStacking(user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({
    summary: 'Stacking API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async stacking(
    @ReqContext() ctx: RequestContext,
    @Body() stackInput: StackingInput,
    @UserScope() user: User
  ) {
    const { amount } = stackInput
    return this.stakeDetailsService.stacking(amount, user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get Info API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async getInfo(@ReqContext() ctx: RequestContext, @UserScope() user: User) {
    return this.stakeDetailsService.getInfo(user.id)
  }

  @Get('slft-price')
  @ApiOperation({
    summary: 'Get Info API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async getInfoAvax() {
    return await this.stakeDetailsService.getSlftPriceFromUtils()
  }
}
