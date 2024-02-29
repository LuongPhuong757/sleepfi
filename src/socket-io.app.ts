import { NestFactory } from '@nestjs/core'

import { SocketIoModule } from './socket-io.module'

;(async function bootstrap() {
  const app = await NestFactory.create(SocketIoModule, {})
  app.enableCors()
  await app.listen(4000)
  console.log('Socket listening on port 4000')
})()
