import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Put,
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
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { ROLE } from '../auth/constants/role.constant'
import { Roles } from '../auth/decorators/role.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { GachaProbConfig } from '../databases/entities/gacha_prob_config.entity'
import { User } from '../databases/entities/user.entity'
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse
} from '../shared/dtos/base-api-response.dto'
import { AdminService } from './admin.service'
import { GachaCostDto } from './dtos/gacha-cost.dto'
import { GachaProbDto } from './dtos/gacha-prob.dto'
import { GachaResetTimeDto } from './dtos/gacha-reset-time.dto'
import { StackingSettingInput } from './dtos/stacking-setting-input.dto'

@Controller('admin')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard, MobileVersionGuard)
@Roles(ROLE.ADMIN)
@ApiGlobalHeaders()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('kpi')
  @ApiOperation({
    summary: 'get kpi of system'
  })
  getKpi() {
    return this.adminService.countActiveNumberSection()
  }

  @Get('total')
  @ApiOperation({
    summary: 'get total of system'
  })
  getTotal() {
    return this.adminService.getTotal()
  }

  @Get('kpi-gacha-user')
  @ApiOperation({
    summary: 'BU (Burned User), Get all information of user used Gacha module'
  })
  getUserUsedGacha() {
    return this.adminService.getGachaInfo('user')
  }

  @Get('kpi-gacha-token')
  @ApiOperation({
    summary: 'Burn, Sum total SLFT token of user used Gacha module'
  })
  getSumTokenUsedGacha() {
    return this.adminService.getGachaInfo('token')
  }

  @Get('gacha-config')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get gacha config'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([GachaProbConfig])
  })
  @UseInterceptors(ClassSerializerInterceptor)
  getGachaInfo(): Promise<GachaProbConfig[]> {
    return this.adminService.getGachaProbSetting()
  }

  @Put('gacha-config-probility')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'set gacha config'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(GachaProbConfig)
  })
  @UseInterceptors(ClassSerializerInterceptor)
  setGachaProbilityInfo(@Body() dto: GachaProbDto): Promise<GachaProbConfig> {
    return this.adminService.setGachaProByType(dto)
  }

  @Put('gacha-config-cost')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'set cost gacha'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(GachaProbConfig)
  })
  @UseInterceptors(ClassSerializerInterceptor)
  setCostGacha(@Body() dto: GachaCostDto): Promise<GachaProbConfig> {
    return this.adminService.setCostOpenGacha(dto)
  }

  @Put('gacha-config-reset-time')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'set gacha config reset time'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([GachaProbConfig, GachaProbConfig])
  })
  @UseInterceptors(ClassSerializerInterceptor)
  setResetTimeGacha(
    @Body() dto: GachaResetTimeDto
  ): Promise<GachaProbConfig[]> {
    return this.adminService.settingResetTime(dto)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Put('stacking-setting')
  @ApiOperation({
    summary: 'update Stacking Setting'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse
  })
  async addStakingSetting(
    @UserScope() user: User,
    @Body() payload: StackingSettingInput
  ) {
    return await this.adminService.addStakingSetting(user, payload)
  }
}
