import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Category } from '../databases/entities/categories.entity'
import {
  BaseApiResponse,
  SwaggerBaseApiResponse
} from '../shared/dtos/base-api-response.dto'
import { CategorySevice } from './category.service'

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categorySevice: CategorySevice) {}

  @Get()
  @ApiOperation({
    summary: 'Get article by id API'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Category])
  })
  async getListCategory(): Promise<BaseApiResponse<Category[]>> {
    const data = await this.categorySevice.getListCategory()
    return {
      data,
      meta: {}
    }
  }
}
