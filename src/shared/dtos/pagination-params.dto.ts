import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Optional, defaults to 100',
    type: Number
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit = 100

  @ApiPropertyOptional({
    description: 'Optional, defaults to 0',
    type: Number
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  offset = 0
}

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty({
    required: false,
    type: Number,
    example: 1,
    description: 'Optional, defaults to 1'
  })
  page?: number = 1

  @ApiPropertyOptional({
    description: 'Optional, defaults to 100',
    type: Number
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit = 100
}
