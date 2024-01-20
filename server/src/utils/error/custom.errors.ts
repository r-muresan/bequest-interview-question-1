
import { STATUS_CODE } from "../status.codes";
import { ERROR_MESSAGES } from './messages.enum.errors'

export class CustomError extends Error {
  error: any;
  status: number;
  constructor(message: string, status: number, error?: any) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

export class UnauthorizedException extends CustomError {
  constructor(error?: any) {
    super(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED, error);
    this.name = this.constructor.name;
  }
}

export class NotFountException extends CustomError {
  constructor(error?: any) {
    super(ERROR_MESSAGES.DATA_NOT_FOUND, STATUS_CODE.NOT_FOUND, error);
    this.name = this.constructor.name;
  }
}

export class BadRequestException extends CustomError {
  constructor(message: string, error?: any) {
    super(message, STATUS_CODE.BAD_REQUEST, error);
    this.name = this.constructor.name;
  }
}

export class NotAcceptableException extends CustomError {
  constructor(message: string, error?: any) {
    super(message, STATUS_CODE.NOT_ACCEPTABLE, error);
    this.name = this.constructor.name;
  }
}

export class InternalServerException extends CustomError {
  constructor(error?: any) {
    super(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
    this.name = this.constructor.name;
  }
}

// export class ZodDtoValidatorException extends CustomError {
//   errors!: FieldErrors;
//   hideErros!: boolean;

//   constructor(error: FieldErrors, hideErros?: boolean) {
//     super(
//       ERROR_MESSAGES.DATA_VALIDATION_FAILURE,
//       STATUS_CODE.NOT_ACCEPTABLE,
//       error
//     );
//     this.name = this.constructor.name;
//     this.errors = error;
//     this.hideErros = hideErros ?? false;
//   }
// }
