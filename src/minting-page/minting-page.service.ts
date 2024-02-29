import { BadRequestException, Injectable } from '@nestjs/common'
import { PATH_IMG } from 'crawler/constants/attributes'

import { NftAttributesRepository } from '../nft-attributes/nft-attributes.repository'
import {
  GetImageNftInMintingPageDto,
  GetImageTxInMintingPageDto
} from './dto/get-image.dto'

@Injectable()
export class MintingPageSevice {
  constructor(private nftAttributesRepository: NftAttributesRepository) {}

  async getImageNft(dto: GetImageNftInMintingPageDto): Promise<any> {
    try {
      const { limit, page, owner, type } = dto

      const query = this.nftAttributesRepository
        .createQueryBuilder('nft')
        .select([
          `CONCAT("${PATH_IMG[type]}", nft.image) as image`,
          'nft.nft_type',
          'nft.name',
          'nft.token_id'
        ])
        .where(`nft.owner = :owner`, { owner: owner })
        .andWhere(`nft.nft_type = :type`, { type: type })
        .limit(limit)
        .offset(limit * (page - 1))

      const [list, count] = await Promise.all([
        query.getRawMany(),
        query.getCount()
      ])
      return {
        data: list,
        page: page,
        totalItem: count
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getImageTx(dto: GetImageTxInMintingPageDto): Promise<any> {
    try {
      const { tokenIds, type } = dto

      const query = this.nftAttributesRepository
        .createQueryBuilder('nft')
        .select([
          `CONCAT("${PATH_IMG[type]}", nft.image) as image`,
          'nft.nft_type',
          'nft.name',
          'nft.token_id'
        ])
        .where(`nft.token_id In (:tokenIds)`, { tokenIds: tokenIds })
        .andWhere(`nft.nft_type = :type`, { type: type })

      const [list] = await Promise.all([query.getRawMany()])
      return {
        data: list
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
