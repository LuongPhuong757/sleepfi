import { InjectQueue, Process } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bull'
import { Connection } from 'typeorm'

@Injectable()
export class BroadcasterService {
  constructor(
    private readonly connection: Connection,
    @InjectQueue('sleefi-socket') private readonly socketQueue: Queue
  ) {}

  async exampleSocketUserBalance() {
    const dataExample = { user_id: 73 }
    await this.socketQueue.add('emitUserBalance', dataExample)
  }

  async example1() {
    const dataExample = { key: 'Example' }
    await this.socketQueue.add('example', dataExample)
  }
}
