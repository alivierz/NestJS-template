import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const authHeader = request.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    return next.handle().pipe(
      map((result) => {
        // 3. Construimos la respuesta estandarizada
        return {
          data: result?.data || {},
          message: result?.message || 'Request successful',
          tracking: result?.tracking || 'GENR0001', // Aquí podrías usar lógica para códigos dinámicos
          token: token || result?.token || null, // Sale de la request, o es null
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
