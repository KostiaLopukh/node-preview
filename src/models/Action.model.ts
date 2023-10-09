import { model, Schema, Types } from "mongoose";

import { User } from "./User.model";

export enum EActionTokenTypes {
  ForgotPassword = "forgotPassword",
}

const actionTokenSchema = new Schema({
  _userId: {
    type: Types.ObjectId,
    required: true,
    red: User,
  },
  actionToken: {
    type: String,
    required: true,
  },
  tokenType: {
    required: true,
    type: String,
    enum: EActionTokenTypes,
  },
});

export const Action = model("Action", actionTokenSchema);
