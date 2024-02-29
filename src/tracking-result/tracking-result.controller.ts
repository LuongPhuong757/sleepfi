import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { ReqContext } from '../shared/request-context/req-context.decorator'
import { RequestContext } from '../shared/request-context/request-context.dto'
import { AverageProfileResponse } from './constant'
import { TrackingResultDto } from './dtos/tracking-result.dto'
import {
  IChartDay,
  IChartWeekMonth,
  TrackingResultSevice
} from './tracking-result.service'

@ApiTags('tracking-result')
@Controller('tracking-result')
@ApiGlobalHeaders()
export class TrackingResultController {
  constructor(private readonly trackingResultService: TrackingResultSevice) {}

  @Get('chart')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async trackingResult(
    @Req() req: any,
    @Query() dto: TrackingResultDto
  ): Promise<IChartDay | IChartWeekMonth> {
    return this.trackingResultService.getChartData(
      req.user.id,
      dto.type,
      dto.fdate,
      dto.tdate
    )
  }

  @Get('average')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK
  })
  async averageProfile(
    @ReqContext() ctx: RequestContext
  ): Promise<AverageProfileResponse> {
    return this.trackingResultService.averageProfile(ctx.user.id)
  }
}
