import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class RepairBedInput {
  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  bedId: number

  @ApiProperty()
  @IsNumber()
  durability: number
}
