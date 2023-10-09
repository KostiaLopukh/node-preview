import * as Joi from "joi";

export class UserValidator {
  private static email = Joi.string()
    .min(2)
    .max(30)
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  private static password = Joi.string()
    .min(2)
    .max(30)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

  static createUser = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static changePassword = Joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}
