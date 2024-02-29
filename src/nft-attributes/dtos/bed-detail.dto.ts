import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNumberString, IsOptional } from 'class-validator'

export class BedDetailDto {
  @IsNumberString()
  @ApiProperty({ required: true, description: 'bed id' })
  bedId: number

  @IsBoolean()
  @ApiProperty({ required: true, type: Boolean })
  @Transform(({ value }) => value === 'true')
  isBase: boolean

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false, type: Number })
  itemId?: number
}
