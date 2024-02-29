import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { User } from '../../databases/entities/user.entity'
import { ROLE } from '../constants/role.constant'

export class AuthTokenOutput {
  @Expose()
  @ApiProperty()
  accessToken: string

  @Expose()
  @ApiProperty()
  refreshToken: string

  @ApiProperty({
    type: User
  })
  @Expose()
  user: User
}

export class UserAccessTokenClaims {
  @Expose()
  id: number
  @Expose()
  username: string
  @Expose()
  roles: ROLE[]
  @Expose()
  wallet?: string
}

export class UserRefreshTokenClaims {
  id: number
}
