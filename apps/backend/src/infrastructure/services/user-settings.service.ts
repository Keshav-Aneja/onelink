import type { UserSettings, UserSettingsUpdate } from "@onelink/entities/models";
import { UserSettingsRepository } from "../repositories/user-settings.repository";

const DEFAULT_SETTINGS: Omit<UserSettings, "id" | "user_id"> = {
  accent_color: "#f63f94",
  view_mode: "grid",
  grid_density: 6,
};

export default class UserSettingsService {
  constructor(private readonly repo = new UserSettingsRepository()) {}

  async getSettings(user_id: string): Promise<UserSettings> {
    const row = await this.repo.getByUserId(user_id);
    if (!row) {
      return { id: "", user_id, ...DEFAULT_SETTINGS };
    }
    return row;
  }

  async updateSettings(user_id: string, data: UserSettingsUpdate): Promise<UserSettings> {
    return this.repo.upsert(user_id, data);
  }
}
