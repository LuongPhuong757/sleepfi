import { NftSales } from 'src/databases/entities/nft_sales.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(NftSales)
export class MarketPlaceRepository extends Repository<NftSales> {}
