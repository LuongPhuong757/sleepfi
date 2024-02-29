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
import { LuckyBox } from 'src/databases/entities/lucky_box.entity'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'
import { SwaggerBaseApiResponse } from 'src/shared/dtos/base-api-response.dto'

import { User } from '../databases/entities/user.entity'
import { SpeedUpInput } from './dtos/speed-up.dto'
import { LuckyBoxSevice } from './lucky-box.service'

@ApiTags('lucky_box')
@Controller('lucky_box')
@ApiGlobalHeaders()
export class LuckyBoxController {
  constructor(private readonly luckyBoxSevice: LuckyBoxSevice) { }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Get Lucky Box API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  async getLuckyBox(@UserScope() user: User) {
    return this.luckyBoxSevice.getLuckyBoxOfUser(user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('open')
  @ApiOperation({
    summary: 'Open Lucky Box API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  async openLuckyBox(
    @Query('luckyBoxId') luckyBoxId: number,
    @UserScope() user: User
  ) {
    return this.luckyBoxSevice.openLuckyBox(luckyBoxId, user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Speed up API'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  async speedUp(@Body() input: SpeedUpInput, @UserScope() user: User) {
    return this.luckyBoxSevice.speedUp(input, user)
  }
}
