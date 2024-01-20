import { Response } from "express";
import { STATUS_CODE } from "../status.codes";
import { CustomError } from './custom.errors'
import { ERROR_MESSAGES } from './messages.enum.errors';

interface FieldErrors {
  [key: string]: string[] | undefined;
}

export class ErrorHandler {
  error!: any;
  status!: number;
  errorMessage!: string;
  name!: string;
  errorData!: string | undefined;
  stack!: string;
  errors!: FieldErrors;
  returnErros!: boolean;

  constructor(error: any) {
    this.error = error;
    this.status = error.status || STATUS_CODE.INTERNAL_SERVER_ERROR;
    this.errorMessage = error.message;
    this.name = error.name;
    this.stack = error.stack;
    this.errors = error.hideErros ? null : error.errors;
    this.errorData = error.errorData;

    // TODO: new relic or datadog here

    console.log(this.error);
  }

  catchError(res: Response) {
    if (this.error instanceof CustomError) {
      return res.status(this.status).send({
        status: this.status,
        errorMessage: this.errorMessage,
        errors: this.errors,
      });
    }

    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorMessage: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}