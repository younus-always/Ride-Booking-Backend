import httpStatus from "http-status-codes";
import { TErrorResponse } from "../interfaces/error.type";

export const handleDuplicateError = (err: any): TErrorResponse => {
      const duplicate = err.message.match(/"([^"]+)"/)[1];

      return {
            statusCode: httpStatus.CONFLICT,
            message: `The email address '${duplicate}' is already registered.`
      };
};