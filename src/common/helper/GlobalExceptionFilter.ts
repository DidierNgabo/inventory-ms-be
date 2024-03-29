import {
  ArgumentsHost,
  ExceptionFilter,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: unknown): string => {
  return String(exception);
};

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<IncomingMessage>();

    const code = getStatusCode(exception);

    const message = getErrorMessage(exception);

    response.status(code).json({
      error: {
        timestamp: new Date().toISOString,
        path: request.url,
        code,
        message,
      },
    });
  }
}
