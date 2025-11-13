import { Types } from "mongoose";

export enum VehicleType {
      Car = "Car",
      Bike = "Bike",
      CNG = "CNG",
};

export interface IVehicleInfo {
      vehicleType: VehicleType;
      brand: string;
      model: string;
      color: string;
      image: string;
      vehicleNumber: string;
      plateNumber: string;
      licenseNumber: string;
      year?: number;
};

export enum DriverStatus {
      Pending = "pending",
      Approved = "approved",
      Rejected = "rejected",
};

export interface IEarningHistory {
      rideId: Types.ObjectId;
      amount: number;
      date: Date
};

export interface IDriver {
      userId: Types.ObjectId;
      vehicleInfo: IVehicleInfo;
      status: DriverStatus;
      isOnline: boolean;
      currentRideId?: string;
      earningHistory?: IEarningHistory[]
};