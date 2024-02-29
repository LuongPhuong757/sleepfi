import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class StackingInput {
  @IsOptional()
  @ApiProperty()
  @IsString()
  amount: string
}
