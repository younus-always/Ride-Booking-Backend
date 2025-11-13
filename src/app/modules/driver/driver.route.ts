import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { driverZodSchema } from "./driver.validation";
import { DriverController } from "./driver.controller";

const router = Router();

router.post("/apply",
      checkAuth(Role.RIDER),
      validateRequest(driverZodSchema),
      DriverController.applyDriver
);
router.patch("/approve/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      DriverController.approveDriver
);

export const DriverRoutes = router;