import { Category } from 'src/databases/entities/categories.entity'
import { EntityRepository, Repository } from 'typeorm'
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}
