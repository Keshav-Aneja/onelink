import { z } from "zod";

export const UserSettingsSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#f63f94"),
  view_mode: z.enum(["grid", "list", "compact"]).default("grid"),
  grid_density: z.number().int().min(3).max(6).default(6),
  show_og_image: z.boolean().default(true),
  show_collection_tree: z.boolean().default(false),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UserSettingsUpdate = Partial<
  Pick<UserSettings, "accent_color" | "view_mode" | "grid_density" | "show_og_image" | "show_collection_tree">
>;
