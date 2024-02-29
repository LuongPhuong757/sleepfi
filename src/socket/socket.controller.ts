import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors
} from '@nestjs/common'
import { ApiGlobalHeaders } from 'src/shared/decorator/api-global-headers.decorator'

@Controller('')
@ApiGlobalHeaders()
@UseInterceptors(ClassSerializerInterceptor)
export default class SocketController {
  @Get('health')
  health() {
    return { status: 'OK' }
  }
}
