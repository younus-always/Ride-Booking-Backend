import { model, Schema } from "mongoose";
import { ChangedBy, IRide, RideStatus, IStatusHistory, ILocation } from "./ride.interface";


const locationSchema = new Schema<ILocation>({
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String }

}, { _id: false });

const statusHistorySchema = new Schema<IStatusHistory>({
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
      changedById: { type: String },
      note: { type: String },
      changedAt: { type: Date, default: Date.now }
}, {
      _id: false
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
      pickup: locationSchema,
      destination: locationSchema,
      fare: { type: Number, required: true },
      status: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.Requested
      },
      statusHistory: [statusHistorySchema],
      requestedAt: { type: Date, default: Date.now },
      acceptedAt: { type: Date },
      pickedUpAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
      cancelReason: { type: String }
}, {
      versionKey: false,
      timestamps: true
});


rideSchema.pre("save", async function (next) {
      if (this.isModified("riderId")) {
            const history = {
                  status: this.status,
                  changedBy: ChangedBy.Rider,
                  changedById: this.riderId
            };

            this.statusHistory = [history];
      }
      next();
});

const cancelRide = async (rideId: string) => {
      const ride = await Ride.findById(rideId);
      if (!ride) {
            throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
      }

      // cancellation after certain statuses
      const nonCancellableStatuses = ["accepted", "picked_up", "in_transit", "completed"];
      if (nonCancellableStatuses.includes(ride.status)) {
            throw new AppError(httpStatus.FORBIDDEN, "You cannot cancel this ride.");
      }

      // update ride status payload
      const payload = {
            status: RideStatus.Cancelled,
            statusHistory: [...ride.statusHistory, {
                  status: RideStatus.Cancelled,
                  changedBy: ChangedBy.Rider,
                  changedById: ride.riderId,
                  note: "I changed my mind to going."
            }]
      };

      const cancelledRide = await Ride.findByIdAndUpdate(rideId, payload, { new: true });
      return cancelledRide;
};


export const Ride = model<IRide>("Ride", rideSchema);