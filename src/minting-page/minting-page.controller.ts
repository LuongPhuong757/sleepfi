import { Body, Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import {
  COST_PUBLIC_SALE_BED,
  COST_PUBLIC_SALE_JEWEL,
  COST_WHITELIST_SALE_BED,
  WHITELIST
} from './constant'
import {
  GetImageNftInMintingPageDto,
  GetImageTxInMintingPageDto
} from './dto/get-image.dto'
import { MintingPageSevice } from './minting-page.service'
@ApiTags('minting-page')
@Controller('minting-page')
@ApiGlobalHeaders()
export class MintingPagelistController {
  constructor(private readonly mintingPageService: MintingPageSevice) {}

  @Get('cost')
  @ApiOperation({
    summary: 'Get the selling price in the minting page'
  })
  async getCost() {
    return {
      whitelistBed: COST_WHITELIST_SALE_BED,
      publicBed: COST_PUBLIC_SALE_BED,
      publicJewel: COST_PUBLIC_SALE_JEWEL
    }
  }

  @Get('whitelist')
  @ApiOperation({
    summary: 'Get Array list user in Whitelist'
  })
  async getWhitelist() {
    return {
      data: WHITELIST
    }
  }

  @Get('image')
  @ApiOperation({
    summary: 'Get image Nft'
  })
  async getImageNft(@Query() dto: GetImageNftInMintingPageDto) {
    return await this.mintingPageService.getImageNft(dto)
  }

  @Get('image-tx')
  @ApiOperation({
    summary: 'Get image Nft'
  })
  async getImageTx(@Query() dto: GetImageTxInMintingPageDto) {
    return await this.mintingPageService.getImageTx(dto)
  }
}
