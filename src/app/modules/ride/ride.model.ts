import { model, Schema } from "mongoose";
import { ChangedBy, IRide, RideStatus, StatusHistoryItem } from "./ride.interface";


const statusHistorySchema = new Schema<StatusHistoryItem>({
      status: {
            type: String,
            enum: Object.values(RideStatus),
            required: true
      },
      changedBy: {
            type: String,
            enum: Object.values(ChangedBy),
            required: true
      },
      changedById: {
            type: Schema.Types.ObjectId,
            ref: "User"
      },
      note: { type: String }
}, {
      _id: false,
      timestamps: true
});

const rideSchema = new Schema<IRide>({
      riderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
      },
      driverId: {
            type: Schema.Types.ObjectId,
            ref: "User"
      },
      pickup: {
            lat: { type: Number },
            lng: { type: Number },
            address: { type: String }
      },
      destination: {
            lat: { type: Number },
            lng: { type: Number },
            address: { type: String }
      },
      fare: { type: Number, required: true },
      status: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.Requested
      },
      statusHistory: {
            type: [statusHistorySchema],
            default: []
      },
      requestedAt: { type: Date, default: Date.now }
}, {
      versionKey: false,
      timestamps: true
});
export const Ride = model<IRide>("Ride", rideSchema);