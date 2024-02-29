import { BullModule } from '@nestjs/bull'
import { DynamicModule, Global, Module } from '@nestjs/common'

import { SharedModule } from '../shared/shared.module'
import { AppGateway } from './app.gateway'
import { BroadcasterService } from './broadcaster.service'
import { SocketConsumer } from './socket.consumer'
import { SocketService } from './socket.service'

type Options = {
  disableConsumer?: boolean
}

@Global()
@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: 'sleefi-socket'
    })
  ],
  providers: [BroadcasterService],
  exports: [BullModule, BroadcasterService]
})
export class SocketModule {
  static forRoot(options: Options = {}): DynamicModule {
    const moduleMetadata: Pick<
      DynamicModule,
      'exports' | 'imports' | 'providers'
    > = {
      imports: [],
      providers: [],
      exports: []
    }
    if (options.disableConsumer !== true) {
      moduleMetadata.providers = [AppGateway, SocketService, SocketConsumer]
      moduleMetadata.exports = [SocketService]
    }
    return {
      global: true,
      module: SocketModule,
      ...moduleMetadata
    }
  }
}
