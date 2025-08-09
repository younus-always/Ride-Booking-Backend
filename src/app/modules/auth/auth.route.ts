import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.creadentialsLogin);
router.post("/logout", AuthController.logOut);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;