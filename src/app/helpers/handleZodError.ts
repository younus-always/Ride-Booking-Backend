import httpStatus from "http-status-codes";
import { TErrorResponse, TErrrorSources } from "../interfaces/error.type";

export const handleZodError = (err: any): TErrorResponse => {
      const errorSources: TErrrorSources[] = [];
      err.issues.forEach((issue: any) => {
            errorSources.push({
                  path: issue.path[issue.path.length - 1],
                  message: issue.message
            });
      });

      return {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Zod Error",
            errorSources
      };
};