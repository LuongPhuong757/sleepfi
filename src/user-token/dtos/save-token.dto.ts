import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class SaveTokenDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsString()
  token: string

  @IsNotEmpty()
  @IsNumber()
  expiredIn: number

  @IsOptional()
  @IsString()
  deviceId: string
}
