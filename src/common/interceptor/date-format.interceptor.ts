import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { formatDate } from '../utils/formatDate.utils';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (typeof data !== 'object' || !data) return data;

                const transformDates = (obj: any) => {
                    for (const key in obj) {
                        if (obj[key] && typeof obj[key] === 'number' && key.toLowerCase().includes('fecha')) {
                            obj[key] = formatDate(obj[key]);
                        } else if (typeof obj[key] === 'object') {
                            transformDates(obj[key]);
                        }
                    }
                };

                transformDates(data);
                return data;
            }),
        );
    }
}
