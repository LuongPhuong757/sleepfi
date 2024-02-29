import { ApiProperty } from '@nestjs/swagger'
import {Expose, Transform} from 'class-transformer'

import { ROLE } from '../../auth/constants/role.constant'

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  username: string

  @Expose()
  @ApiProperty()
  wallet: string

  @Expose()
  @ApiProperty({ example: [ROLE.USER] })
  roles: ROLE[]

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty()
  sex: string

  @Expose()
  @ApiProperty()
  birthday: number

  @Expose()
  @ApiProperty()
  isAccountDisabled: boolean

  @Expose()
  @ApiProperty()
  isNotification: boolean

  @Expose()
  @ApiProperty()
  isNewLetter: boolean

  @Expose()
  @ApiProperty()
  createdAt: string

  @Expose()
  @ApiProperty()
  updatedAt: string

  @Expose()
  @ApiProperty()
  @Transform(({value}) => parseFloat(value))
  positiveEffect: number;
}
