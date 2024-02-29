import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { AppLogger } from './shared/logger/logger.service'
import { ReqContext } from './shared/request-context/req-context.decorator'
import { RequestContext } from './shared/request-context/request-context.dto'
import { BroadcasterService } from './socket/broadcaster.service'

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
    private readonly broadcasterService: BroadcasterService
  ) {
    this.logger.setContext(AppController.name)
  }

  @Get()
  getHello(@ReqContext() ctx: RequestContext): string {
    this.logger.log(ctx, 'Hello world from App controller')

    return this.appService.getHello(ctx)
  }

  @Get('test-socket')
  async testSocket() {
    try {
      await this.broadcasterService.exampleSocketUserBalance()
    } catch (error) {
      console.log(error)
    }
  }
}
