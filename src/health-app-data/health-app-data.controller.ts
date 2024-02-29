import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { HealthAppDataDto } from './dto/create-data-health-app.dto'
import { HealthAppDataSevice } from './health-app-data.service'

@ApiTags('health-app')
@Controller('health-app')
@ApiGlobalHeaders()
export class HealthAppDataController {
  constructor(private readonly healthAppDataSevice: HealthAppDataSevice) {}

  @Post()
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async insertDataFromHealthApp(
    @Body() healthAppDataDto: HealthAppDataDto,
    @Req() req: any
  ) {
    return await this.healthAppDataSevice.insertDataFromHealthApp(
      req.user,
      healthAppDataDto
    )
  }
}
