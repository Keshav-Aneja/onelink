import type { UserSettings, UserSettingsUpdate } from "@onelink/entities/models";
import db from "@onelink/db";

export class UserSettingsRepository {
  async getByUserId(user_id: string): Promise<UserSettings | undefined> {
    const [row] = await db("user_settings").where({ user_id }).select("*");
    return row;
  }

  async upsert(user_id: string, data: UserSettingsUpdate): Promise<UserSettings> {
    const [row] = await db("user_settings")
      .insert({ user_id, ...data })
      .onConflict("user_id")
      .merge({ ...data, updated_at: db.fn.now() })
      .returning("*");
    return row;
  }
}
