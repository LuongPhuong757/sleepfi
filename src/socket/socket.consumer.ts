import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Connection } from 'typeorm'

import { SocketService } from './socket.service'

@Processor('sleefi-socket')
export class SocketConsumer {
  constructor(
    private readonly socketService: SocketService,
    private readonly connection: Connection
  ) {}

  @Process('example')
  emitExample(job: Job) {
    this.socketService.server.emit('example', job.data)
  }

  @Process('emitUserBalance')
  async emitUserBalance(job: Job) {
    const { user_id } = job.data
    const result = { user_id: user_id, user_balance: 70 }
    this.socketService.server.to(user_id).emit('user_balance', result)
  }
}
