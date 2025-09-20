import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { formatDate } from '../utils/formatDate.utils';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (typeof data !== 'object' || !data) return data;

                const visited = new WeakSet();

                const transformDates = (obj: any) => {
                    if (obj === null || typeof obj !== 'object') return obj;
                    if (visited.has(obj)) return obj; // evita ciclos
                    visited.add(obj);

                    if (Array.isArray(obj)) {
                        return obj.map((item) => transformDates(item));
                    }

                    for (const key in obj) {
                        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

                        const value = obj[key];
                        if (value && typeof value === 'number' && key.toLowerCase().includes('fecha')) {
                            obj[key] = formatDate(value);
                        } else if (typeof value === 'object') {
                            obj[key] = transformDates(value);
                        }
                    }
                    return obj;
                };

                return transformDates(data);
            }),
        );
    }
}
