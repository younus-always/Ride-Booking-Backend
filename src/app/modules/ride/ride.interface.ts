import { Types } from "mongoose";


export interface ILocation {
      lat: number;
      lng: number;
      address?: string
};

export enum RideStatus {
      Requested = "requested",
      Accepted = "accepted",
      PickedUp = "picked_up",
      InTransit = "in_transit",
      Completed = "completed",
      Cancelled = "cancelled",
};

export enum ChangedBy {
      Rider = "Rider",
      Driver = "Driver",
      Admin = "Admin",
      System = "System",
};

export interface IRideStatusHistory {
      status: RideStatus;
      changedBy: ChangedBy;
      changedById?: Types.ObjectId;      // riderId/driverId/adminId
      note?: string;
      changedAt?: Date;
};


export interface IRide {
      _id?: Types.ObjectId ;
      riderId: Types.ObjectId;        // reference to Rider.id
      driverId?: Types.ObjectId;     // assigned driver id (if any)
      pickup: ILocation;
      destination: ILocation;
      fare: number;
      status: RideStatus;
      statusHistory: IRideStatusHistory[]; // every change logged
      requestedAt?: Date;
      acceptedAt?: Date;
      pickedUpAt?: Date;
      completedAt?: Date;
      cancelledAt?: Date;
      cancelReason?: string;
};
