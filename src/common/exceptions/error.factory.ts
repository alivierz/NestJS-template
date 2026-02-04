import { HttpStatus } from '@nestjs/common';
import { AppError } from './custom-exceptions';
import { parseDatabaseError } from '../utils/db_parse_response.utils';

export class ErrorFactory {
  static serviceError(
    message: string,
    internalCode: string,
    status = HttpStatus.BAD_REQUEST,
  ) {
    return new AppError('SERVICE', message, status, internalCode);
  }

  static controlError(
    message: string,
    internalCode: string,
    status = HttpStatus.BAD_REQUEST,
  ) {
    return new AppError('CONTROLE', message, status, internalCode);
  }

  static dbError(error: any, internalCode: string) {
    const message = parseDatabaseError(error);
    // El último parámetro es el error original que capturó el catch
    return new AppError('SERVICE', message, 406, internalCode, error);
  }

  static dtoError(
    message: string,
    internalCode = 'DTOE0001',
    status = HttpStatus.BAD_REQUEST,
  ) {
    return new AppError('VALIDATE', message, status, internalCode);
  }
}
