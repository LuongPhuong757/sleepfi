import { EntityRepository, In, Repository } from 'typeorm'

import { BedInformation } from '../../databases/entities/bed_information.entity'
import { NftAttributes } from '../../databases/entities/nft_attributes.entity'

@EntityRepository(BedInformation)
export class BedInformationRepository extends Repository<BedInformation> {
  async getBedSocket(bedId: number): Promise<NftAttributes[]> {
    const bedSockets = await this.findOne({ where: { bedId } })
    let nftsJewel: any = []
    if (bedSockets) {
      const jewelIds = [
        bedSockets.jewelSlot1,
        bedSockets.jewelSlot2,
        bedSockets.jewelSlot3,
        bedSockets.jewelSlot4,
        bedSockets.jewelSlot5
      ].filter((e) => !!e)
      nftsJewel = await this.manager.find(NftAttributes, {
        where: {
          nftId: In(jewelIds)
        }
      })
    }
    return nftsJewel
  }

  async getBedByBedId(bedId: number) {
    return await this.createQueryBuilder('bi')
      .select([
        'bi.bed_id as bed_id',
        'bi.item_id as item_id',
        'bi.socket as socket',
        'bi.enable as enable'
      ])
      .where('bi.bed_id = :bed_id', { bed_id: bedId })
      .getRawOne()
  }
}
