import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserController.createUser)
router.get("/all-user", UserController.getAllUsers)
router.patch("/:id", validateRequest(updateUserZodSchema), UserController.updateUser)

export const UserRoutes = router;