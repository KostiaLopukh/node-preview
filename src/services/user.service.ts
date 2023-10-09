import { IUser } from "../controllers/user.controller";
import { ApiError } from "../errors/api.error";
import { User } from "../models/User.model";

export interface IQuery {
  page: string;
  limit: string;
  sortedBy: string;

  [key: string]: string;
}

interface IPaginationResponse<T> {
  page: number;
  perPage: number;
  itemsCount: number;
  itemsFound: number;
  data: T[];
}

class UserService {
  public async findWithPagination(
    query: IQuery
  ): Promise<IPaginationResponse<IUser>> {
    try {
      const queryStr = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`)
      );

      const {
        page = 1,
        limit = 5,
        sortedBy = "createdAt",
        ...searchObject
      } = queryObj;

      const skip = +limit * (+page - 1);

      const users = await User.find(searchObject)
        .skip(skip)
        .limit(+limit)
        .sort(sortedBy);
      const usersTotalCount = await User.count();

      return {
        page: +page,
        itemsCount: usersTotalCount,
        perPage: +limit,
        itemsFound: users.length,
        data: users,
      };
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async findAll(): Promise<IUser[]> {
    return User.find();
  }

  public async create(data: IUser): Promise<IUser> {
    return User.create({ ...data }) as unknown as IUser;
  }

  public async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    return User.findOneAndUpdate(
      { _id: id },
      { ...data },
      { returnDocument: "after" }
    );
  }

  public async deleteById(id: string): Promise<IUser> {
    return User.findOneAndDelete({ _id: id }, { returnDocument: "after" });
  }
}

export const userService = new UserService();
