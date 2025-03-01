import type { User, UserInsert } from "@onelink/entities/models";

export interface IUserService {
  getOrCreateUser(data: UserInsert): Promise<User>;
  checkIfUserExists(providerID: string): Promise<Boolean>;
}
