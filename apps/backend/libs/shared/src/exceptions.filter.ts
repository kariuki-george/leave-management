import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();
    const message =
      exception instanceof Error
        ? exception.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message
          : 'Something went wrong, please try again'
        : 'Something went wrong, please try again';
    const status =
      exception instanceof HttpException
        ? exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR
          ? HttpStatus.BAD_REQUEST
          : exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.verbose(exception);
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      success: false,
      error: 'Bad Request',
      message,
    });
  }
}
