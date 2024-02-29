import { Poins } from 'src/databases/entities/bed_point.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(Poins)
export class PoinsRepository extends Repository<Poins> {}
