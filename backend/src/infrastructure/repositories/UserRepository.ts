import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import {
  UserModel,
  IUserDocument
} from "../database/models/userModel";


export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<User | null> {

    const user = await UserModel.findOne({ email });

    if (!user) {
      return null;
    }
    return this.mapToEntity(user);
  }

  
  async create(user: User): Promise<User> {

    const createdUser = await UserModel.create(user);

    return this.mapToEntity(createdUser);
  }

  private mapToEntity(user: IUserDocument): User {

    return {
      _id: user._id.toString(),

      name: user.name,

      email: user.email,

      password: user.password,

      role: user.role
    };
  }
}