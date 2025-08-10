import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthController.creadentialsLogin);
router.post("/logout", AuthController.logOut);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/reset-password",
      checkAuth(...Object.values(Role)),
      AuthController.resetPassword
);
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
      const redirect = req.query.redirect || "/";
      passport.authenticate("google", {
            scope: ["profile", "email"],
            state: redirect as string
      })(req, res, next);
});
router.get("/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }), AuthController.googleCallbackController
);


export const AuthRoutes = router;