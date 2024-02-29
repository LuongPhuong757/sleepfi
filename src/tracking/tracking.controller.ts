import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserIdThrottlerGuard } from '../auth/guards/user-id-throttler.guard'
import { Tracking } from '../databases/entities/tracking.entity'
import { TrackingResult } from '../databases/entities/tracking-result.entity'
import { SwaggerBaseApiResponse } from '../shared/dtos/base-api-response.dto'
import { ReqContext } from '../shared/request-context/req-context.decorator'
import { RequestContext } from '../shared/request-context/request-context.dto'
import { CreateTrackingDto } from './dtos/create-tracking.dto'
import { TrackingService } from './tracking.service'

@Controller('tracking')
@ApiTags('Sleep tracking')
@ApiGlobalHeaders()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @Throttle(1, 2)
  @UseGuards(JwtAuthGuard, UserIdThrottlerGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create tracking API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Tracking)
  })
  async createTracking(
    @Body() dto: CreateTrackingDto,
    @ReqContext() ctx: RequestContext
  ): Promise<any> {
    return this.trackingService.createTracking(dto, ctx.user.id)
  }

  @Get('/estimate-tracking')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Estimate tracking'
  })
  async estimateTracking(@ReqContext() ctx: RequestContext) {
    return this.trackingService.estimateEarnWrapperApi(ctx.user.id)
  }

  @Get('/tracking-result/:id')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get tracking result'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TrackingResult
  })
  async getTrackingResult(@Param('id') id: number): Promise<TrackingResult> {
    return this.trackingService.getTrackingResult(id)
  }

  @Post('/wake-up')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'tracking wake up'
  })
  async wakeUp(@ReqContext() ctx: RequestContext) {
    return this.trackingService.wakeUp(ctx.user.id)
  }

  @Get('/user-status-tracking')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get tracking status off user'
  })
  userStatusTracking(@ReqContext() ctx: RequestContext) {
    return this.trackingService.getStatusTracking(ctx.user.id)
  }
}
