import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { configs } from "../configs/config";
import { IJwt } from "../controllers/auth.controller";
import { EActionTokenTypes } from "../models/Action.model";

interface ITokenPayload {
  id: Types.ObjectId;
}

export enum EAuthTokenTypes {
  Access = "access",
  Refresh = "refresh",
}

class TokenService {
  public generateTokensPair(payload: ITokenPayload): IJwt {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, tokenType = EAuthTokenTypes.Access) {
    let secret;

    switch (tokenType) {
      case EAuthTokenTypes.Access:
        secret = configs.JWT_ACCESS_SECRET;
        break;
      case EAuthTokenTypes.Refresh:
        secret = configs.JWT_REFRESH_SECRET;
        break;
    }

    return jwt.verify(token, secret);
  }

  public generateActionToken(
    payload: ITokenPayload,
    tokenType: EActionTokenTypes
  ): string {
    let secret;

    switch (tokenType) {
      case EActionTokenTypes.ForgotPassword:
        secret = configs.JWT_FORGOT_SECRET;
        break;
    }

    return jwt.sign(payload, secret, { expiresIn: "7d" });
  }

  public checkActionToken(token: string, tokenType: EActionTokenTypes) {
    let secret;

    switch (tokenType) {
      case EActionTokenTypes.ForgotPassword:
        secret = configs.JWT_FORGOT_SECRET;
        break;
    }

    return jwt.verify(token, secret) as ITokenPayload;
  }
}

export const tokenService = new TokenService();
