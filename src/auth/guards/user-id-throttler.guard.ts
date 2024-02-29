import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class UserIdThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    if (request.headers.authorization) {
      const user = request.user
      const key = this.generateKey(context, user.id)
      const ttls = await this.storageService.getRecord(key)

      if (ttls.length >= limit) {
        throw new ThrottlerException()
      }

      await this.storageService.addRecord(key, ttl)
    }

    return true
  }
}
