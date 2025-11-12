import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";
import { validateRequest } from "../../middlewares/validateRequest";
import { resetPasswordSchema, setPasswordSchema } from "./auth.validation";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.post("/logout", AuthController.logOut);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/change-password",
      checkAuth(...Object.values(Role)),
      AuthController.changePassword
);
router.post("/forget-password",
      checkAuth(...Object.values(Role)),
      AuthController.forgetPassword
);
router.post("/reset-password",
      checkAuth(...Object.values(Role)),
      validateRequest(resetPasswordSchema),
      AuthController.resetPassword
);
router.post("/set-password",
      checkAuth(...Object.values(Role)),
      validateRequest(setPasswordSchema),
      AuthController.setPassword
);
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
      const redirect = req.query.redirect || "/";
      passport.authenticate("google", {
            scope: ["profile", "email"],
            state: redirect as string
      })(req, res, next);
});
router.get("/google/callback", passport.authenticate("google", {
      failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact our support team.`
}),
      AuthController.googleCallbackController
);

export const AuthRoutes = router;
