import httpStatus from "http-status-codes";
import { TErrorResponse, TErrrorSources } from "../interfaces/error.type";
import mongoose from "mongoose";

export const handleValidationError = (err: mongoose.Error.ValidationError): TErrorResponse => {
      const errorSources: TErrrorSources[] = [];
      const errors = Object.values(err.errors);

      errors.forEach((errObj: any) => {
            errorSources.push({
                  path: errObj.path,
                  message: errObj.message
            });
      });

      return {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Validation Error",
            errorSources
      };
};