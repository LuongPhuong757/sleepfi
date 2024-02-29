import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class VerifyUserCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    default: 'ABC123'
  })
  activeCode: string
}
