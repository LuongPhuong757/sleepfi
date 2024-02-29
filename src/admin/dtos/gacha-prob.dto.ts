import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

import {
  BED_QUALITY_ENUM,
  GachaValueTypeEnum,
  SettingGachaProb
} from '../constants'

class ValueSettingGachaProb {
  @IsOptional()
  @IsEnum(GachaValueTypeEnum)
  @ApiProperty({
    enum: GachaValueTypeEnum,
    example: GachaValueTypeEnum.BED,
    description: 'Type gacha probility'
  })
  type: GachaValueTypeEnum

  @IsEnum(BED_QUALITY_ENUM)
  @IsOptional()
  @ApiProperty({
    enum: BED_QUALITY_ENUM,
    example: BED_QUALITY_ENUM.COMMON,
    description: 'item or bed or jewel quality'
  })
  quality: BED_QUALITY_ENUM

  // @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 0
  })
  level: string | number

  // @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'COMMON_BED'
  })
  value: number | string

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1
  })
  amount: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1.5
  })
  percent: number

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Rainbow'
  })
  frame_colour: string

  @IsOptional()
  @ApiProperty({
    example: 'common_bed'
  })
  name: string

  @IsOptional()
  @ApiProperty({
    example: 1
  })
  category: number
}

export class GachaProbDto {
  @IsEnum(SettingGachaProb)
  @ApiProperty({
    enum: SettingGachaProb,
    example: SettingGachaProb.NORMAL_GACHA_MAIN_NET,
    description: 'Type gacha probility'
  })
  key: SettingGachaProb

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueSettingGachaProb)
  @ApiProperty({
    type: [ValueSettingGachaProb],
    example: [
      [
        {
          type: 'bed',
          level: 0,
          value: 'COMMON_BED',
          amount: 1,
          percent: 1,
          quality: 'common',
          category: 1,
          frame_colour: 'Gold'
        },
        {
          type: 'bed',
          level: 0,
          value: 'UNCOMMON_BED',
          amount: 1,
          percent: 0.1,
          quality: 'uncommon',
          category: 1,
          frame_colour: 'Rainbow'
        },
        {
          type: 'jewel',
          level: 1,
          value: 'JEWEL_LV1',
          amount: 1,
          percent: 10,
          quality: 'common',
          category: 2,
          frame_colour: 'Normal'
        },
        {
          type: 'jewel',
          level: 2,
          value: 'JEWEL_LV2',
          amount: 1,
          percent: 5,
          quality: 'common',
          category: 2,
          frame_colour: 'Normal'
        },
        {
          type: 'jewel',
          level: 3,
          value: 'JEWEL_LV3',
          amount: 1,
          percent: 2,
          quality: 'common',
          category: 2,
          frame_colour: 'Gold'
        },
        {
          type: 'jewel',
          level: 4,
          value: 'JEWEL_LV4',
          amount: 1,
          percent: 1,
          quality: 'common',
          category: 2,
          frame_colour: 'Rainbow'
        },
        {
          type: 'item',
          level: 1,
          value: 'ITEM_LV1',
          amount: 1,
          percent: 35,
          quality: 'common',
          category: 3,
          frame_colour: 'Normal'
        },
        {
          type: 'item',
          level: 2,
          value: 'ITEM_LV2',
          amount: 1,
          percent: 11.05,
          quality: 'common',
          category: 3,
          frame_colour: 'Normal'
        },
        {
          type: 'item',
          level: 3,
          value: 'ITEM_LV3',
          amount: 1,
          percent: 2,
          quality: 'common',
          category: 3,
          frame_colour: 'Gold'
        },
        {
          type: 'item',
          level: 4,
          value: 'ITEM_LV4',
          amount: 1,
          percent: 1,
          quality: 'common',
          category: 3,
          frame_colour: 'Rainbow'
        },
        {
          type: 'slft',
          value: 'slft 10',
          amount: 10,
          percent: 16,
          frame_colour: 'Normal'
        },
        {
          type: 'slft',
          value: 'slft 50',
          amount: 50,
          percent: 8,
          frame_colour: 'Normal'
        },
        {
          type: 'slft',
          value: 'slft 100',
          amount: 100,
          percent: 4,
          frame_colour: 'Normal'
        },
        {
          type: 'slft',
          value: 'slft 500',
          amount: 500,
          percent: 2,
          frame_colour: 'Normal'
        },
        {
          type: 'slft',
          value: 'slft 1000',
          amount: 1000,
          percent: 1,
          frame_colour: 'Normal'
        },
        {
          type: 'slft',
          value: 'slft 2000',
          amount: 2000,
          percent: 0.5,
          frame_colour: 'Gold'
        },
        {
          type: 'slft',
          value: 'slft 5000',
          amount: 5000,
          percent: 0.2,
          frame_colour: 'Gold'
        },
        {
          type: 'slft',
          value: 'slft 10000',
          amount: 10000,
          percent: 0.1,
          frame_colour: 'Rainbow'
        },
        {
          type: 'slft',
          value: 'slft 20000',
          amount: 20000,
          percent: 0.05,
          frame_colour: 'Rainbow'
        }
      ]
    ]
  })
  value: ValueSettingGachaProb[]
}
