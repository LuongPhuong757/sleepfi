import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { abi } from 'src/common/Utils'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { CreateTxHistoryDto } from '../tx-history/dto/tx-history.dto'
import { GetTxHistoryDto } from './dto/get-tx-history'
import { ListDepositDto } from './dto/list-deposit.dto'
import { GetListTransaction } from './dto/list-transaction.dto'
import { TxHistorySevice } from './tx-history.service'
@ApiTags('tx-history')
@Controller('tx-history')
@ApiGlobalHeaders()
export class TxHistoryController {
  constructor(private readonly txHistorySevice: TxHistorySevice) {}
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('tx-history')
  async insertIntoTxHistory(@Body() createTxHistoryDto: CreateTxHistoryDto) {
    return await this.txHistorySevice.insertIntoTxHistory(createTxHistoryDto)
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async getPendingTxHistory(
    @Query() payload: GetTxHistoryDto,
    @Req() req: any
  ) {
    return await this.txHistorySevice.getPendingTxHistory(req.user.id, payload)
  }

  @Get('user-transaction')
  async getTxHistory(
    @Query() payload: GetListTransaction
  ) {
    return await this.txHistorySevice.getTxHistory(payload)
  }

  @Get('deposit-token')
  async getTxHistoryAllUser(@Query() payload: ListDepositDto) {
    return await this.txHistorySevice.getTxHistoryAllUser(payload)
  }
}
