import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UserTokenService } from '../../user-token/user-token.service'
import { STRATEGY_JWT_AUTH } from '../constants/strategy.constant'
import { AuthService } from '../services/auth.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
  constructor(
    private authService: AuthService,
    private userTokenService: UserTokenService
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    // Add your custom authentication logic here
    const request = context.switchToHttp().getRequest()
    if (request.headers.authorization) {
      const decodedData: any = this.authService.decodeToken(
        request.headers.authorization.split('Bearer ')[1]
      )
      const latestToken = await this.userTokenService.getActiveUserToken(
        decodedData?.sub
      )
      if (
        latestToken &&
        request.headers.authorization.split('Bearer ')[1] !== latestToken.token
      ) {
        throw new UnauthorizedException('jwt is expired.')
      }
    }
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(`${info}`)
    }

    return user
  }
}
