import { HttpException } from '@nestjs/common';

export type ErrorOrigin = 'VALIDE' | 'CONTROLE' | 'SERVICE' | 'VALIDATE';

export class AppError extends HttpException {
  constructor(
    public readonly origin: ErrorOrigin,
    public readonly message: string,
    statusCode: number,
    public readonly internalCode: string,
    cause?: any,
  ) {
    super(message, statusCode);

    // Si nos pasaron un error previo, robamos su stack trace
    if (cause && cause.stack) {
      this.stack = cause.stack;
    }
  }
}
