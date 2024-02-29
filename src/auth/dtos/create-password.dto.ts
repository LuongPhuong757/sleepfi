import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength
} from 'class-validator'

export class CreatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string

  @IsOptional()
  @ApiProperty({
    type: 'string',
    default: 'ABC123'
  })
  activeCode?: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: 'number',
    default: 123456
  })
  otp: number
}
