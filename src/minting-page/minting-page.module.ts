import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { NftAttributesRepository } from '../nft-attributes/nft-attributes.repository'
import { MintingPagelistController } from './minting-page.controller'
import { MintingPageSevice } from './minting-page.service'

@Module({
  imports: [TypeOrmModule.forFeature([NftAttributesRepository])],
  controllers: [MintingPagelistController],
  providers: [MintingPageSevice]
})
export class MintingPagelistModule {}
