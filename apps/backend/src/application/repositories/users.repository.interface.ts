import type { User, UserInsert } from "@onelink/entities/models";

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByProviderID(providerID: string): Promise<User | undefined>;
  createUser(input: UserInsert): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
}
