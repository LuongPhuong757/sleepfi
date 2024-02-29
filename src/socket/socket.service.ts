import { Injectable } from '@nestjs/common'
import _ from 'lodash'
import { Server } from 'socket.io'
import { SocketId } from 'socket.io-adapter'

type Target = number | string

@Injectable()
export class SocketService {
  server: Server
  private clientIdMap: { [key: string]: { target: Target } } = {}

  getClientIds(target: Target) {
    return _.reduce(
      this.clientIdMap,
      (result, val, clientId) => {
        if (target == val.target) {
          result.push(clientId)
        }
        return result
      },
      [] as SocketId[]
    )
  }

  setClientId(id: SocketId, target: Target) {
    this.clientIdMap[id] = { target }
  }

  delClientId(id: SocketId) {
    delete this.clientIdMap[id]
  }
}
