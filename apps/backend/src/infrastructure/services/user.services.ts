import type { UserInsert, User } from "@onelink/entities/models";
import type { IUserService } from "../../application/services/user.services.interface";
import { UsersRepository } from "../repositories/users.repository";

export class UserService implements IUserService {
  constructor(private userRepository = new UsersRepository()) {}

  async getOrCreateUser(data: UserInsert): Promise<User> {
    const user = await this.userRepository.getUserByProviderID(
      data.provider_id,
    );
    if (!user) {
      const newUser = await this.userRepository.createUser(data);
      return newUser;
    }
    return user;
  }

  async checkIfUserExists(providerID: string): Promise<Boolean> {
    const user = await this.userRepository.getUserByProviderID(providerID);
    if (!user) {
      return false;
    }
    return true;
  }
}
