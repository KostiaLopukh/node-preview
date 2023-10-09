import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/register",
  // userMidldeware.isValidRegister,
  authController.register
);

router.post("/login", authController.login);

router.post(
  "/change-password",
  // commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword
);

router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/:token", authController.setForgotPassword);


export const authRouter = router;
