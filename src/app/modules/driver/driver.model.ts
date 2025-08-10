import { model, Schema } from "mongoose";
import { ApprovelStatus, IDriver, IEarningHistory, IVehicleInfo } from "./driver.interface";

const vehicleInfoSchema = new Schema<IVehicleInfo>({
      vehicleType: { type: String, required: true },
      model: { type: String, required: true },
      plateNumber: { type: String, unique: true, required: true }
}, {
      _id: false
});

const earningHistorySchema = new Schema<IEarningHistory>({
      rideId: { type: String },
      amount: { type: Number, required: true },
      date: { type: Date }
}, { _id: false });

const driverSchema = new Schema<IDriver>({
      userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
      },
      approvalStatus: {
            type: String,
            enum: Object.values(ApprovelStatus),
            default: ApprovelStatus.pending
      },
      vehicleInfo: vehicleInfoSchema,
      isOnline: { type: Boolean, required: true },
      earningHistory: [earningHistorySchema]
}, {
      versionKey: false,
      timestamps: true
});
export const Driver = model<IDriver>("Driver", driverSchema);