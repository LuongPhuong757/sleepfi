import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserScope } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { User } from '../databases/entities/user.entity'
import { UserSpinGachaDto } from './dtos/user-spin-gacha.dto'
import { GachaSevice } from './gacha.service'

@ApiTags('gacha')
@Controller('gacha')
@ApiGlobalHeaders()
export class GachaController {
  constructor(private readonly gachaService: GachaSevice) { }

  @Post('spin')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async spin(
    @Body() dto: UserSpinGachaDto,
    @UserScope() user: User
  ): Promise<any> {
    return this.gachaService.spin(dto, user)
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async history(@UserScope() user: User): Promise<any> {
    return this.gachaService.getHistoryGacha(user)
  }

  @Get('get-probability-config')
  async getProbConfigs(): Promise<any> {
    return await this.gachaService.getProbConfig()
  }

  @Post('get-common-bed')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async GetCommonBed(@UserScope() user: User): Promise<any> {
    return await this.gachaService.getFreeBedGacha(
      user.id,
      user.wallet,
      'common'
    )
  }

  @Post('get-special-bed')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async GetSpecialBed(@UserScope() user: User): Promise<any> {
    return await this.gachaService.getFreeBedGacha(
      user.id,
      user.wallet,
      'special'
    )
  }
}
