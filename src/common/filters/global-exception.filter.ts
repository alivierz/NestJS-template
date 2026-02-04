import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../exceptions/custom-exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.url === '/favicon.ico') {
      return response.status(204).end(); // 204 No Content: silencio total
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const stack = exception instanceof Error ? exception.stack : null;
    let tracking = 'UNKNOWN000';
    let message = 'Error no controlado';
    let extraData = {}; // Para guardar los 'values' del DTO

    const authHeader = request.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (exception instanceof AppError) {
      status = exception.getStatus();
      tracking = `${exception.internalCode}`;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent: any = exception.getResponse();

      message =
        typeof resContent === 'object' ? resContent.message : exception.message;

      // Si el error viene del ValidationPipe, capturamos el arreglo 'values'
      if (resContent.values) {
        extraData = { values: resContent.values };
      }

      tracking = `VALIDATION${status}`;
    }

    this.logger.error(
      `[${tracking}] ${request.method} ${request.url} - ${JSON.stringify(message)}`,
    );

    this.logger.debug(stack);

    response.status(status).json({
      data: extraData, // Aquí caerán los errores del DTO: { values: [...] }
      tracking: tracking,
      token: token,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
