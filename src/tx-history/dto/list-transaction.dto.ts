import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import MsgHelper from "src/common/MessageUtils";

export class GetListTransaction {
  @ApiProperty({ default: 1, required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ default: 10, required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @IsNotEmpty({ message: MsgHelper.MsgList.err_required })
  @ApiProperty()
  @IsEmail({}, { message: MsgHelper.MsgList.address_invalid })
  @MaxLength(200, { message: MsgHelper.MsgList.err_required })
  email: string
}
