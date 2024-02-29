import { Injectable } from '@nestjs/common'

import { Category } from '../databases/entities/categories.entity'
import { CategoryRepository } from './category.repository'

@Injectable()
export class CategorySevice {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getListCategory(): Promise<Category[]> {
    const data = await this.categoryRepository.find()
    return data.map((x) => {
      delete x.updatedAt
      delete x.createdAt
      return x
    })
  }
}
