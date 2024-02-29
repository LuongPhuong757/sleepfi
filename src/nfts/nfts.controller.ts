import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
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
import { NftAttributes } from 'src/databases/entities/nft_attributes.entity'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

import { Nfts } from '../databases/entities/nfts.entity'
import { User } from '../databases/entities/user.entity'
import {
  BaseApiResponse,
  SwaggerBaseApiResponse
} from '../shared/dtos/base-api-response.dto'
import { AttachJewelsInput } from './dtos/attach-jewels.dto'
import { ConfirmLevelUpInput } from './dtos/confirm-level-up'
import { GetListDto } from './dtos/get-list.dto'
import { GetTokenToUpgradeInput } from './dtos/get-token-to-upgrade.dto'
import { LevelUpInput } from './dtos/level-up.dto'
import { MintingInput } from './dtos/minting-dto'
import { RepairBedInput } from './dtos/repair-bed.dto'
import { SellNftInput } from './dtos/sell-nft.dto'
import { UpgradeNftsInput } from './dtos/upgrade-nft.dto'
import { NftSevice } from './nfts.service'

@ApiTags('nft')
@Controller('nft')
@ApiGlobalHeaders()
export class NftController {
  constructor(private readonly nftService: NftSevice) { }
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get('get-level-up')
  @ApiOperation({
    summary: 'Get level up bed Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async getLevelUp(@UserScope() user: User, @Query('bedId') bedId: number) {
    return await this.nftService.getLevelUp(user, bedId)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get('family-nft')
  @ApiOperation({
    summary: 'Get family Nft'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Nfts])
  })
  async getFamilyNft(@Query('bedId') bedId: number) {
    return this.nftService.getFamilyNft(bedId)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get('transaction-fee')
  @ApiOperation({
    summary: 'Get transaction fee Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async getTransactionFee(@UserScope() user: User) {
    return await this.nftService.getTransactionFee()
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get('repair')
  @ApiOperation({
    summary: 'Get Repair Bed Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async getRepairBed(@UserScope() user: User, @Query('bedId') bedId: number) {
    return await this.nftService.getRepairBed(bedId, user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get('upgrade')
  @ApiOperation({
    summary: 'Get token for upgrade'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Nfts])
  })
  async getTokenForUpgrade(
    @UserScope() user: User,
    @Query() getTokenToUpgradeInput: GetTokenToUpgradeInput
  ) {
    const { level, upgradeType } = getTokenToUpgradeInput
    return await this.nftService.getTokenForUpgrade(level, upgradeType, user)
  }

  // @UseGuards(JwtAuthGuard, MobileVersionGuard)
  // @ApiBearerAuth()
  // @Get('list')
  // @ApiOperation({
  //   summary: 'Get NFT by type',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: SwaggerBaseApiResponse([Nfts])
  // })
  // async getNftByType(@UserScope() user: User, @Query() dto: GetListDto): Promise<BaseApiResponse<Nfts[]>> {
  //   return this.nftService.getNftByType(dto, user);
  // }

  @Get()
  @ApiOperation({
    summary: 'Setting active code for sign up'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Nfts])
  })
  async listNftByType(
    @Query() dto: GetListDto
  ): Promise<BaseApiResponse<Nfts[]>> {
    return this.nftService.listNftByType(dto)
  }

  @Get('/:type/:tokenId')
  @ApiOperation({
    summary: 'Get detail Nft'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Nfts])
  })
  async getDetailNft(
    @Param('type') type: string,
    @Param('tokenId') tokenId: number
  ) {
    return await this.nftService.getDetailNftByTokenId(type, tokenId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details nft Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Nfts])
  })
  async getDetail(@Param('id') id: number): Promise<Nfts> {
    return await this.nftService.getDetailsNft(id)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('sell')
  @ApiOperation({
    summary: 'Sell nft Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async sellNft(@UserScope() user: User, @Body() sellNftInput: SellNftInput) {
    return await this.nftService.sellNft(sellNftInput, user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('cancel-sell')
  @ApiOperation({
    summary: 'Cancel sell nft Api'
  })
  @ApiResponse({
    status: HttpStatus.OK
  })
  async cancelSellNft(@UserScope() user: User, @Query('nftId') nftId: number) {
    return await this.nftService.cancelSellNft(nftId, user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('upgrade')
  @ApiOperation({
    summary: 'Upgrade Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async upgradeNft(
    @UserScope() user: User,
    @Body() upgradeNftsInput: UpgradeNftsInput
  ) {
    return await this.nftService.upgradeNft(upgradeNftsInput, user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('repair')
  @ApiOperation({
    summary: 'Repair Bed Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async repairBed(
    @UserScope() user: User,
    @Body() repairBedInput: RepairBedInput
  ) {
    return await this.nftService.repairBed(repairBedInput, user)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('level-up')
  @ApiOperation({
    summary: 'Level up bed Api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async levelUp(
    @UserScope() user: User,
    @Body() ConfirmLevelUpInput: ConfirmLevelUpInput
  ) {
    return await this.nftService.levelUp(ConfirmLevelUpInput, user)
  }

  // API Minting
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Get('get-minting/:bedIdParent1/:bedIdParent2')
  @ApiOperation({
    summary: 'get minting api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async getMinting(
    @UserScope() user: User,
    @Param('bedIdParent1') bedIdParent1: number,
    @Param('bedIdParent2') bedIdParent2: number
  ) {
    return await this.nftService.getMinting(bedIdParent1, bedIdParent2, user)
  }

  // API Minting
  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Post('minting')
  @ApiOperation({
    summary: 'post minting api'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([NftAttributes])
  })
  async postMinting(
    @UserScope() user: User,
    @Body() mintingInput: MintingInput
  ) {
    return await this.nftService.postMinting(user, mintingInput)
  }

  @UseGuards(JwtAuthGuard, MobileVersionGuard)
  @ApiBearerAuth()
  @Put('update-level-up')
  async updateNftLevelUp(
    @UserScope() user: User,
    @Query('bedId') bedId: number
  ) {
    return await this.nftService.updateNftLevelUp(bedId, user)
  }
}
