import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class GetNftDetailInput {
  @IsOptional()
  @ApiProperty()
  @IsString()
  type: string

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tokenId: number
}
