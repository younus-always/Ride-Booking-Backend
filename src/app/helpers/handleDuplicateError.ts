import httpStatus from "http-status-codes";
import { TErrorResponse } from "../interfaces/error.type";

export const handleDuplicateError = (err: any): TErrorResponse => {
      let errMsg;
      const errArray = err.message.match(/"([^"]+)"/);
      const duplicate = err.message.match(/"([^"]+)"/)[1];
      console.log("Error from duplicate", err);

      if (errArray["input"].includes("userId")) {
            errMsg = `This user '${duplicate}' already exist.`;
      }
      else if (errArray["input"].includes("vehicleNumber")) {
            errMsg = `This vehicleNumber '${duplicate}' already exist.`;
      }
      else if (errArray["input"].includes("plateNumber")) {
            errMsg = `This plateNumber '${duplicate}' vehicle already exist.`;
      }
      else if (errArray["input"].includes("licenseNumber")) {
            errMsg = `This licenseNumber '${duplicate}' vehicle already exist.`;
      }
      else {
            errMsg = `The email address '${duplicate}' is already registered.`;
      };


      return {
            statusCode: httpStatus.CONFLICT,
            message: errMsg
      };
};