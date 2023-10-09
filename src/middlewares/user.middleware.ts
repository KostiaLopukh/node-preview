import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { UserValidator } from "../validators/user.validator";

class UserMiddleware {
  public async isValidRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error } = UserValidator.createUser.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isValidChangePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error } = UserValidator.changePassword.validate(req.body);

      if (error) {
        throw new ApiError(error.message, 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMidldeware = new UserMiddleware();
