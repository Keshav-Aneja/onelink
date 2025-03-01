import type { User, UserInsert } from "@onelink/entities/models";
import type { IUsersRepository } from "../../application/repositories/users.repository.interface";
import db from "@onelink/db";
import { DatabaseOperationError } from "@onelink/entities/errros";

export class UsersRepository implements IUsersRepository {
  /**
   *
   * @param id
   * @returns User
   */
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db("users").where({ id }).returning("*");
    return user;
  }
  /**
   *
   * @param email
   * @returns User
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db("users").where({ email }).returning("*");
    return user;
  }

  /**
   *
   * @param input: UserInsert
   * @returns User
   */
  async createUser(input: UserInsert): Promise<User> {
    const [user] = await db("users").insert(input).returning("*");

    if (!user) {
      throw new DatabaseOperationError("Cannot create user");
    }

    return user;
  }
  async getUserByProviderID(providerID: string): Promise<User | undefined> {
    const [user] = await db("users")
      .where({ provider_id: providerID })
      .returning("*");

    return user;
  }
}
