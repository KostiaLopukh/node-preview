import { Model, model, Schema } from "mongoose";

import { IUser } from "../controllers/user.controller";

export enum EGenders {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface IUserModel extends Model<IUser, object, IUserMethods> {
  findByName(name: string): Promise<IUser>;
}

export interface IUserMethods {
  nameWithAge(): string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
      min: 0,
      max: 199,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: EGenders,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.statics = {
  async findByName(name: string): Promise<IUser> {
    return this.findOne({ name });
  },
};

userSchema.methods = {
  nameWithAge() {
    return `${this.name} is ${this.age} years old`;
  },
};

export const User = model<IUser, IUserModel>("user", userSchema);
