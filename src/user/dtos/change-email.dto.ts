import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsString } from 'class-validator'

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty()
  @IsNumber()
  otp: number

  @ApiProperty()
  @IsString()
  password: string
}
