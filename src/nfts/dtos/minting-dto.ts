import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber } from 'class-validator'

export class MintingInput {
  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  bedIdParent1: number

  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  bedIdParent2: number

  @ApiProperty()
  @IsBoolean()
  @ApiProperty()
  isInsurance: boolean
}
