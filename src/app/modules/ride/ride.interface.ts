import { Types } from "mongoose";

export enum RideStatus {
      Requested = "requested",
      Accepted = "accepted",
      PickedUp = "picked_up",
      InTransit = "in_transit",
      Cancelled = "cancelled",
      Completed = "completed"
};
export enum ChangedBy {
      Rider = "rider",
      Driver = "driver",
      Admin = "admin",
      System = "system"
};

export interface StatusHistoryItem {
      status: RideStatus;
      changedBy: ChangedBy;
      changedById?: string;      // userId/driverId/adminId
      note?: string;
};

export interface IPickup {
      lat: number;
      lng: number;
      address?: string
};
export interface IDestination {
      lat: number;
      lng: number;
      address?: string
};

export interface IRide {
      id?: Types.ObjectId;
      riderId: Types.ObjectId;           // reference to Rider.id
      driverId?: Types.ObjectId;  // assigned driver id (if any)
      pickup: IPickup;
      destination: IDestination;
      fare: number;
      status: RideStatus;
      statusHistory: StatusHistoryItem[]; // every change logged
      requestedAt?: Date;
};
