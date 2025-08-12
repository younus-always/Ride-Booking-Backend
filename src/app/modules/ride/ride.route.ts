import { Router } from "express";
import { RideController } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";

const router = Router();

router.post("/request", validateRequest(createRideZodSchema), RideController.requestRide);
router.get("/all-rides", RideController.getAllRides);

export const RideRoutes = router;