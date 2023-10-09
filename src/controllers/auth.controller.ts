import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";

interface IMessage {
  message: string;
}

export interface IJwt {
  accessToken: string;
  refreshToken: string;
}

class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IJwt>> {
    try {
      const tokensPair = await authService.login(req.body);

      return res.status(200).json({ ...tokensPair });
    } catch (e) {
      next(e);
    }
  }

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IMessage>> {
    try {
      await authService.register(req.body);

      return res.status(201).json({
        message: "User created",
      });
    } catch (e) {
      next(e);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.res.locals.tokenPayload;
      await authService.changePassword(req.body, userId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { newPassword } = req.body;
      const { token } = req.params;

      await authService.setForgotPassword(newPassword, token);

      return res.sendStatus(200).json({
        message: "Password updated",
      });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
