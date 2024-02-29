import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class VerifyInput {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  signedMessage: string

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  signer: string
}
