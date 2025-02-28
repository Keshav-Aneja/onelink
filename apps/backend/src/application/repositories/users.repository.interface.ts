import type { User, UserInsert } from "@onelink/entities/models";

export interface IUsersRepository {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(input: UserInsert): Promise<User>;
}
