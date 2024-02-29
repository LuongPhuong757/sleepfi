import {
    CanActivate,
    ExecutionContext,
    HttpVersionNotSupportedException,
    Injectable,
} from '@nestjs/common'

@Injectable()
export class MobileVersionGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean {
        // const request = context.switchToHttp().getRequest()
        // if(!request.headers.version || (request.headers.version && request.headers.version !== (process.env.MOBILE_VERSION || "1.1"))) {
        //     throw new HttpVersionNotSupportedException(`please_update_app_to_latest_version` )
        // }
        return true;
    }
}
