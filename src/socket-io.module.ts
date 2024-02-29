import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'

import SocketController from './socket/socket.controller'
import { SocketModule } from './socket/socket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env', '.env.production'],
      load: []
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => config.get('databaseConfig')!,
    //   inject: [ConfigService],
    // }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => config.get('redisConfig')!,
    //   inject: [ConfigService],
    // }),
    SocketModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 0
    })
  ],
  controllers: [SocketController]
})
export class SocketIoModule {}
