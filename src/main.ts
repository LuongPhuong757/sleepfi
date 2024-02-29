import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { MobileVersionGuard } from './auth/guards/mobile.version'
import { VALIDATION_PIPE_OPTIONS } from './shared/constants'
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware'
const basicAuth = require('express-basic-auth')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('', {
    exclude: [{ path: 'nft/:type/:tokenId', method: RequestMethod.GET }]
  })
  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  app.use(RequestIdMiddleware)
  app.enableCors()

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Nestjs API starter')
    .setDescription('Nestjs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  // config login swagger
  const docsPath = `/swagger`
  app.use(
    docsPath,
    basicAuth({
      challenge: true,
      users: { admin: 'SleefiAdmin@123' }
    })
  )

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')
  await app.listen(port)
}
bootstrap()
