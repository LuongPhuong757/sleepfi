import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNumberString, IsOptional } from 'class-validator'

export class EstimateEarnDto {
  @IsNumberString()
  @ApiProperty({
    description: 'id of bed used',
    required: true,
    example: '1'
  })
  bedUsed: number

  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    description: 'id of item used',
    required: false,
    example: '1'
  })
  itemUsed: number

  @IsBoolean()
  @ApiProperty({
    description: 'is enableInsurance',
    example: true,
    required: false
  })
  @Transform(({ value }) => value === 'true')
  isEnableInsurance: boolean
}
