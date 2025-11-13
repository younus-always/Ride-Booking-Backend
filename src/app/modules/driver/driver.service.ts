import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { DriverStatus, IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";

const applyDriver = async (userId: string, payload: Partial<IDriver>) => {
      const isExistDriver = await Driver.findById(userId);
      if (isExistDriver) {
            throw new AppError(StatusCodes.CONFLICT, "You are already apply as a driver.");
      }

      const result = await Driver.create({ userId, ...payload });
      return result;
};

const approveDriver = async (driverId: string) => {
      const driver = await Driver.findById(driverId);
      if (!driver) {
            throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
      }
      const user = await User.findById(driver.userId);
      if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      }

      await User.findOneAndUpdate({ _id: user._id }, { role: Role.DRIVER }, { new: true });
      const approvedDriver = await Driver.findByIdAndUpdate(driverId, { status: DriverStatus.Approved }, { new: true });

      return approvedDriver;
};


export const DriverService = {
      applyDriver,
      approveDriver
};