import { model, Schema } from "mongoose";
import { DriverStatus, IDriver, IEarningHistory, IVehicleInfo, VehicleType } from "./driver.interface";

const vehicleInfoSchema = new Schema<IVehicleInfo>({
      vehicleType: {
            type: String,
            enum: Object.values(VehicleType),
            required: true
      },
      brand: { type: String, required: true, trim: true },
      model: { type: String, required: true, trim: true },
      color: { type: String, required: true, trim: true },
      image: { type: String, required: true },
      vehicleNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
      },
      plateNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
      },
      licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
      },
      year: {
            type: Number,
            min: 1990,
            max: new Date().getFullYear()
      }
}, {
      _id: false
});

const earningHistorySchema = new Schema<IEarningHistory>({
      rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now }
}, { _id: false });

const driverSchema = new Schema<IDriver>({
      userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
      },
      vehicleInfo: vehicleInfoSchema,
      status: {
            type: String,
            enum: Object.values(DriverStatus),
            default: DriverStatus.Pending
      },
      isOnline: { type: Boolean, default: false },
      currentRideId: {
            type: Schema.Types.ObjectId,
            ref: "Ride"
      },
      earningHistory: {
            type: [earningHistorySchema],
            default: []
      }
}, {
      versionKey: false,
      timestamps: true
});

export const Driver = model<IDriver>("Driver", driverSchema);