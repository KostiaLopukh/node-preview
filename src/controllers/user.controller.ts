import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

import { IQuery, userService } from "../services/user.service";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: number;
}

class UserController {
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findWithPagination(
        req.query as unknown as IQuery
      );

      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const createdUser = await userService.create(req.body);

      return res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const updatedUser = await userService.updateById(req.params.id, req.body);

      return res.status(201).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const deletedUser = await userService.deleteById(req.params.id);

      return res.status(200).json(deletedUser);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
