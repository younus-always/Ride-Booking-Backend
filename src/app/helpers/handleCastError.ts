/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { TErrorResponse } from "../interfaces/error.type";
import mongoose from "mongoose";

export const handleCastError = (err: mongoose.Error.CastError): TErrorResponse => {

      return {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Invalid resource identifier. Please provide a valid MongoDB ObjectID."
      };
};