import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class AttachJewelsInput {
  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  bedId: number
}
