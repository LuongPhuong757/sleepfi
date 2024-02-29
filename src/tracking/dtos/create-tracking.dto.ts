import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTrackingDto {
  @IsBoolean()
  @ApiProperty({
    description: 'is enableInsurance',
    example: true,
    required: false
  })
  isEnableInsurance: boolean

  @IsBoolean()
  @ApiProperty({
    description: 'Is turn on or off alarm',
    required: true,
    example: 'true'
  })
  alrm: boolean

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'timestamp of alarm ring',
    required: true,
    example: '1656899144'
  })
  wakeUp: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'id of item used',
    required: false,
    example: '1'
  })
  itemUsed: number

  @IsNumber()
  @ApiProperty({
    description: 'id of bed used',
    required: true,
    example: '1'
  })
  bedUsed: number
}
