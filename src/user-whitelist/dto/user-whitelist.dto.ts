import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator'

import MsgHelper from '../../common/MessageUtils'

export class UserWhitelistDto {
  @IsNotEmpty({ message: MsgHelper.MsgList.err_required })
  @ApiProperty()
  @IsEmail({}, { message: MsgHelper.MsgList.address_invalid })
  @MaxLength(200, { message: MsgHelper.MsgList.err_required })
  email: string
}
