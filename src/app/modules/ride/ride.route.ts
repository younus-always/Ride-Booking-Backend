import { Router } from "express";
import { RideController } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema, updateRideStatusZodSchema } from "./ride.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/request",
      checkAuth(Role.RIDER),
      validateRequest(createRideZodSchema),
      RideController.requestRide
);
router.get("/all-rides",
      checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
      RideController.getAllRides
);
// router.get("/me",
//       checkAuth(Role.RIDER, Role.DRIVER),
//       RideController.rideHistory
// );
router.patch("/:id/cancel",
      checkAuth(Role.RIDER),
      RideController.cancelRide
);
router.patch("/:id/status",
      checkAuth(Role.DRIVER),
      validateRequest(updateRideStatusZodSchema),
      RideController.updateRideStatus
);

export const RideRoutes = router;