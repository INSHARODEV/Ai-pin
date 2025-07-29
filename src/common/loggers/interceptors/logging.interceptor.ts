import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
 
import { formatTimestamp, logToFile } from '../helpers/logEntry';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
         const { method, url } = request;
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const executionTime = Date.now() - start;
                const statusCode = response.statusCode;

                const logEntry = {
                    timestamp: formatTimestamp(),
                    method,
                    url,
                    statusCode,
                    executionTime: `${executionTime}ms`
                };

                this.logger.log(JSON.stringify(logEntry));
                logToFile(logEntry);
            }),
        );
    }
}
