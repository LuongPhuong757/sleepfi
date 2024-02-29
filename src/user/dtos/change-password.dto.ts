import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  otp: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string
}
