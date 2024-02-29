import { NftSales } from 'src/databases/entities/nft_sales.entity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(NftSales)
export class PaymentRepository extends Repository<NftSales> {}
