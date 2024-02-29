import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class StackSettingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  start: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  end: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  value: number
}
