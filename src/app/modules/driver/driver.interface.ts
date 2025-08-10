import { Types } from "mongoose";

export interface IVehicleInfo {
      vehicleType: "Car" | "Bike";
      model: string;
      plateNumber: string
};

export enum ApprovelStatus {
      pending = "pending",
      approved = "approved",
      suspended = "suspended"
};

export interface IEarningHistory {
      rideId: string;
      amount: number;
      date: Date
};

export interface IDriver {
      userId: Types.ObjectId;
      vehicleInfo: IVehicleInfo;
      approvalStatus: ApprovelStatus;
      isOnline: boolean;
      currentRideId?: string;
      earningHistory: IEarningHistory[]
};