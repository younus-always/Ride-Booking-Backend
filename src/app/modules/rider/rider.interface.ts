import { Types } from "mongoose";

export interface Rider {
      id: Types.ObjectId;
      userId: Types.ObjectId;     // reference to User._id
      currentRideId?: Types.ObjectId;
      cancelCount: number;
      defaultPickupLocation?: {
            lat: number;
            lng: number;
            address?: string;
      };
      // Optionally store quick access to recent rideIds
      recentRides?: string[];    // optional cache
}

