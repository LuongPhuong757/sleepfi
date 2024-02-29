import { BedHistory } from 'src/databases/entities/bed_history.entity'
import { Nfts } from 'src/databases/entities/nfts.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(Nfts)
export class NftRepository extends Repository<Nfts> {
  async insertBedHistory(
    bedId: number,
    efficiency: string,
    luck: string,
    bonus: string,
    special: string,
    resilience: string
  ) {
    const bedHistory = new BedHistory()
    bedHistory.bedId = bedId
    bedHistory.efficiency = efficiency
    bedHistory.luck = luck
    bedHistory.bonus = bonus
    bedHistory.special = special
    bedHistory.resilience = resilience
    return await bedHistory.save()
  }
}
