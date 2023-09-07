import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message =
      'Something went wrong. We have been notified and are fixing it😊.';

    if (
      exception instanceof Error &&
      exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      this.logger.error(exception);

      return response
        .status(500)
        .json({ message, error: 'Internal Server Error' });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR
          ? HttpStatus.BAD_REQUEST
          : exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(exception);
  }
}
