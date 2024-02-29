import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Connection } from 'typeorm'

import { UserToken } from '../databases/entities/user_token.entity'
import { SocketService } from './socket.service'

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly socketService: SocketService,
    private readonly connection: Connection
  ) {}

  afterInit(server: Server) {
    this.socketService.server = server
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.socketService.delClientId(client.id)
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('identity')
  async identity(client: Socket, data) {
    if (data) {
      const user = await this.connection.manager.findOne(UserToken, {
        token: data
      })
      if (!user) return
      this.socketService.setClientId(client.id, user.userId)
      return `Identified user: ${user.userId}`
    } else {
      this.socketService.delClientId(client.id)
    }
  }
}
