import { HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { ExceptionResponse } from '../dtos';

/**
 *
 * Extract the stringifies error code
 *
 * @param exResponse - exception response
 * @returns - string that describes the error
 */
export const getCode = (exResponse: ExceptionResponse | string): string => {
  if (typeof exResponse === 'string') {
    return formatErrorCode(exResponse);
  }

  if ('error' in exResponse && typeof exResponse.error === 'string') {
    return formatErrorCode(exResponse.error);
  }

  return formatErrorCode(HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]);
};

/**
 * Format a string to uppercase and snakeCase
 *
 * @param error - string
 * @returns - ex `Bad Request` become `BAD_REQUEST`
 */
const formatErrorCode = (error: string): string => {
  return _.toUpper(_.snakeCase(error));
};

/**
 *
 * Extract the error messages
 *
 */
export const getErrorMessageOld = (exceptionResponse: ExceptionResponse | string, httpStatus: string): ExceptionResponse => {
  let message;
  let detail;

  if (typeof exceptionResponse === 'string') {
    message = exceptionResponse;
  } else {
    if (_.isArray(exceptionResponse.message)) {
      console.log('exceptionResponsegeterr:', exceptionResponse);
      /* 
      {
  message: [ 'topicCategoryName must be a string' ],
  error: 'Bad Request',
  statusCode: 400
}
      */
      message = exceptionResponse.error;
      detail = _.map(exceptionResponse.message, (_message) => ({ message: _message }));
    } else {
      message = exceptionResponse.message;
      detail = exceptionResponse.error;
    }
  }

  return {
    message: message || _.startCase(_.toLower(httpStatus)),
    detail,
  };
};
export const getErrorMessage = (exceptionResponse: ExceptionResponse | string, httpStatus: string): ExceptionResponse => {
  let message;
  let detail;

  if (typeof exceptionResponse === 'string') {
    message = exceptionResponse;
  } else {
    if (_.isArray(exceptionResponse.message)) {
      // console.log('exceptionResponsegeterr:', exceptionResponse);
      /* 
      {
  message: [ 'topicCategoryName must be a string' ],
  error: 'Bad Request',
  statusCode: 400
}
      */
      // message = `${exceptionResponse.error} - ${exceptionResponse.message?.toString()}`;
      message = `${exceptionResponse.message?.toString()}`;
      detail = _.map(exceptionResponse.message, (_message) => ({ message: _message }));
    } else {
      message = `${exceptionResponse.message?.toString()}`;
      // message = `${exceptionResponse.error} - ${exceptionResponse.message?.toString()}`;
      detail = exceptionResponse.error;
    }
  }

  return {
    message: message || _.startCase(_.toLower(httpStatus)),
    detail,
  };
};
