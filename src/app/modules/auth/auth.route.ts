import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", AuthController.creadentialsLogin);
router.post("/logout", AuthController.logOut);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword);

export const AuthRoutes = router;