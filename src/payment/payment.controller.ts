import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ListNftsByOwnerDto } from 'src/nft-attributes/dtos/list-nft-by-owner.dto'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { PaymentDto } from './dto/payment.dto'
import { PaymentService } from './payment.service'

@ApiTags('Payment')
@Controller('payment')

export class PaymentControler {
  constructor(private readonly paymenService: PaymentService) {}

  @Post('hook')
  async payoutHook(@Req() req: any, @Body() dto) {
    try {
      return await this.paymenService.payoutWebhook(dto)
    } catch (error) {
      throw error
    }
  }

  @Post('orders/reserve')
  @ApiGlobalHeaders()
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get wyre payment checkout URL'
  })
  async orderPayout(@Body() dto: PaymentDto) {
    return await this.paymenService.widgetCheckout(dto)
  }

  @ApiGlobalHeaders()
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve the countries currently supported by the Wyre widget'
  })
  @Get('supported_countries')
  async getSupportedCountries() {
    return await this.paymenService.getSupportedCountries()
  }
}
