import {
  Body,
  Controller,
  Get,
  Optional,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserScope } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MobileVersionGuard } from 'src/auth/guards/mobile.version'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { User } from '../databases/entities/user.entity'
import { BedDetailDto } from './dtos/bed-detail.dto'
import { ListItemOwnerDto } from './dtos/list-item-by-owner.dto'
import { ListJewelOwnerDto } from './dtos/list-jewel-by-owner.dto'
import { ListItemJewelByTypeLevelDto } from './dtos/list-jewel-item-by-level-type.dto'
import { ListNftsByOwnerDto } from './dtos/list-nft-by-owner.dto'
import { ListNftsInHomePageDto } from './dtos/list-nft-in-home-page.dto'
import { NftAttributesSevice } from './nft-attributes.service'

@ApiTags('nft-attributes')
@Controller('nft-attributes')
@ApiGlobalHeaders()
export class NftAttributesController {
  constructor(private readonly nftAttributesSevice: NftAttributesSevice) { }

  @Get('nft-by-owner')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async getNftByOwner(@Query() payload: ListNftsByOwnerDto, @Req() req: any) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.getNftByOwner(
      userInfo.wallet,
      payload
    )
  }

  @Get('get-nft-by-type')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async getNftByType(
    @Query() payload: ListItemJewelByTypeLevelDto,
    @Req() req: any
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.getJewelOrItemByLevelAndType(
      userInfo.wallet,
      payload
    )
  }

  @Get('nft-in-home-page')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async listBedByOwnerInHomePage(
    @Query() payload: ListNftsInHomePageDto,
    @Req() req: any
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.listBedByOwnerInHomePage(
      userInfo.wallet,
      payload,
      req.user.id,
    )
  }

  @Post('item-by-owner')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async getItemByOwner(@Body() payload: ListItemOwnerDto, @Req() req: any) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.getItemByOwner(
      userInfo.wallet,
      payload
    )
  }

  @Get('bed-detail')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async bedDetail(@Query() bedDetailDto: BedDetailDto, @Req() req: any) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.bedDetail(
      bedDetailDto,
      userInfo.wallet
    )
  }

  @Get('list-jewels')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async getListJewelsByUser(
    @Req() req: any,
    @Query() payload: ListNftsInHomePageDto
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.getListJewelsByUser(
      userInfo.wallet,
      payload
    )
  }

  @Put('add-item-for-bed')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async addItemForBed(
    @Req() req: any,
    @Query('bedId') bedId: number,
    @Query('itemId') itemId: number
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.addItemForBed(
      userInfo.wallet,
      bedId,
      itemId
    )
  }

  @Put('remove-item-from-bed')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async removeItemFromBed(
    @Req() req: any,
    @Query('bedId') bedId: number,
    @Query('itemId') itemId: number
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.removeItemFromBed(
      userInfo.wallet,
      bedId,
      itemId
    )
  }

  @Put('open-socket')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async openSocket(
    @Req() req: any,
    @Query('bedId') bedId: number,
    @Query('index') index: number
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return this.nftAttributesSevice.openSocket(userInfo.wallet, bedId, index)
  }

  @Put('add-jewels')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async addJewelsForBed(
    @Req() req: any,
    @Body() listJewelOwnerDto: ListJewelOwnerDto
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.addJewelsForBed(
      userInfo.wallet,
      listJewelOwnerDto
    )
  }

  @Put('remove-jewels')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async removeJewelForBed(
    @Req() req: any,
    @Body() listJewelOwnerDto: ListJewelOwnerDto
  ) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.removeJewelForBed(
      userInfo.wallet,
      listJewelOwnerDto
    )
  }

  @Get('list-bedbox')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async listBedBoxByOwner(@Req() req: any) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.listBedBoxByOwner(userInfo.wallet)
  }

  @Post('open-bedbox')
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  async openBedBox(@Query('bedboxId') bedboxId: number, @Req() req: any) {
    const userInfo = await this.nftAttributesSevice.getUserWalletByUserId(
      req.user.id
    )
    if (!userInfo || (userInfo && !userInfo.wallet)) return
    return await this.nftAttributesSevice.openBedBox(userInfo.wallet, bedboxId)
  }
}
