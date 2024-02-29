import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate
} from 'class-validator'
import MsgHelper from 'src/common/MessageUtils'

import { CustomCapitalText } from '../../shared/custom-validation/CustomCapitalText'

export class SignupDto {
  @Validate(CustomCapitalText, {
    message: 'Email is contains capital letter.'
  })
  @IsEmail({}, { message: MsgHelper.MsgList.incorrect_email })
  @IsNotEmpty({ message: MsgHelper.MsgList.err_required })
  @ApiProperty({
    type: 'email',
    default: 'anh.nguyen5@sotatek.com'
  })
  email: string

  @IsNumber()
  @IsNotEmpty({ message: MsgHelper.MsgList.err_required })
  @ApiProperty({
    type: 'number',
    default: 123456
  })
  otp: number

  @ApiProperty({ default: false })
  @IsBoolean()
  isNewLetter: boolean
}
