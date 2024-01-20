import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/error/handler.errors";
import {  CustomError, InternalServerException,  } from "../utils/error/custom.errors";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
  
) => {

  const customError = error instanceof CustomError
  if(!customError) {
    error = new InternalServerException(error)
  }

  new ErrorHandler(error).catchError(res)
  next();
};