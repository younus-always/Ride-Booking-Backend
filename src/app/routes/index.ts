import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RideRoutes } from "../modules/ride/ride.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/rides",
    route: RideRoutes
  },
  {
    path: "/driver",
    route: DriverRoutes
  }
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});