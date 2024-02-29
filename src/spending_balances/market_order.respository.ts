import { MarketOrders } from 'src/databases/entities/market-orders.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(MarketOrders)
export class MarketOrderRepository extends Repository<MarketOrders> {}
