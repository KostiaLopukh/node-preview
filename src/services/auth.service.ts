import { EEmailActions } from "../constants/email.constants";
import { IJwt } from "../controllers/auth.controller";
import { IUser } from "../controllers/user.controller";
import { ApiError } from "../errors/api.error";
import { Action, EActionTokenTypes } from "../models/Action.model";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

interface ICredentials {
  email: string;
  password: string;
}

class AuthService {
  public async register(body: IUser): Promise<void> {
    try {
      const { password } = body;
      const hashedPassword = await passwordService.hash(password);

      await User.create({ ...body, password: hashedPassword });
      await emailService.sendMail(body.email, EEmailActions.WELCOME, {
        name: body.name,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(body: ICredentials): Promise<IJwt> {
    try {
      const { password, email } = body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError("Invalid email or password", 401);
      }

      const isMatched = await passwordService.compare(password, user.password);
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }

      const tokensPair = tokenService.generateTokensPair({ id: user._id });
      await Token.create({
        ...tokensPair,
        _userId: user._id,
      });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changePassword(
    data: { newPassword: string; oldPassword: string },
    userId: string
  ): Promise<void> {
    try {
      const user = await User.findById(userId).select("password");

      const isMatched = await passwordService.compare(
        data.oldPassword,
        user.password
      );

      if (!isMatched) {
        throw new ApiError("Invalid password", 400);
      }

      const hashedNewPassword = await passwordService.hash(data.newPassword);

      await User.updateOne({ _id: userId }, { password: hashedNewPassword });
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError("User not found", 400);
      }

      const actionToken = tokenService.generateActionToken(
        { id: user._id },
        EActionTokenTypes.ForgotPassword
      );

      await Promise.all([
        Action.create({
          actionToken,
          tokenType: EActionTokenTypes.ForgotPassword,
          _userId: user._id,
        }),
        emailService.sendMail(email, EEmailActions.FORGOT_PASSWORD, {
          token: actionToken,
          name: user.name,
        }),
      ]);
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async setForgotPassword(
    newPassword: string,
    token: string
  ): Promise<void> {
    try {
      const tokenFromDb = await Action.findOne({
        actionToken: token,
        tokenType: EActionTokenTypes.ForgotPassword,
      });
      if (!tokenFromDb) {
        throw new ApiError("Invalid token provided", 400);
      }

      const payload = tokenService.checkActionToken(
        token,
        EActionTokenTypes.ForgotPassword
      );

      const hashedNewPassword = await passwordService.hash(newPassword);

      await User.updateOne(
        { _id: payload.id },
        { password: hashedNewPassword }
      );
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }
}

export const authService = new AuthService();
