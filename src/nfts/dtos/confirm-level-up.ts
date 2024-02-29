import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ConfirmLevelUpInput {
  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  bedId: number
}
