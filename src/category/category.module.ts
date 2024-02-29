import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryController } from './category.controller'
import { CategoryRepository } from './category.repository'
import { CategorySevice } from './category.service'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategorySevice]
})
export class CategoryModule {}
