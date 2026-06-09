import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: import('@nestjs/common').CallHandler,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        const res = context.switchToHttp().getResponse<Response>();
        const statusCode = res.statusCode;

        const message = `${method} ${originalUrl} ${statusCode} ${responseTime}ms`;

        if (statusCode >= 500) {
          this.logger.error(message);
        } else if (statusCode >= 400) {
          this.logger.warn(message);
        } else {
          this.logger.log(message);
        }
      }),
    );
  }
}
