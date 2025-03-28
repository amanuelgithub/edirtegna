import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { PROBLEM_CONTENT_TYPE } from '../constants';
import { DetailResponse } from '../dtos';
import { getErrorMessage } from '../utils';
const excludePaths = (): string[] => [];
@Injectable()
@Catch()
export class ExceptionsFilter<T> implements ExceptionFilter {
  constructor(private readonly apiPrefix: string) {}

  catch(_exception: T, _host: ArgumentsHost): void {
    const excludePathsList = excludePaths();
    const ctx = _host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    let message;
    let data = null;

    if (excludePathsList.includes(request.url)) {
      if (_exception instanceof HttpException) {
        response.status(_exception.getStatus()).json(_exception.getResponse());
      }
      return;
    }

    if (_exception instanceof HttpException) {
      status = _exception.getStatus();
      data = _exception['options'];
      const exceptionResponse = getErrorMessage(_exception.getResponse(), HttpStatus[status]);
      message = exceptionResponse.message;
    } else {
      const error = _exception as any;
      message = error.message;
    }
    const detailResponse = new DetailResponse(data, message, false, status);

    response.type(PROBLEM_CONTENT_TYPE).status(status).json(detailResponse);
  }
}
