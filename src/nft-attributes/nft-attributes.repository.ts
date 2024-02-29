import { NftAttributes } from 'src/databases/entities/nft_attributes.entity'
import { EntityRepository, Repository } from 'typeorm'

import { CATEGORY_ID } from './constants'
@EntityRepository(NftAttributes)
export class NftAttributesRepository extends Repository<NftAttributes> {
  async checkItemOfOwner(owner, bedId, itemId) {
    return this.createQueryBuilder('na')
      .leftJoin('nfts', 'n', 'n.id = na.nft_id')
      .where('owner = :owner', { owner })
      .andWhere('n.category_id IN (:cate)', {
        cate: [CATEGORY_ID.BED, CATEGORY_ID.ITEM]
      })
      .andWhere('na.nftId IN (:arr)', { arr: [bedId, itemId] })
      .getCount()
  }
}
