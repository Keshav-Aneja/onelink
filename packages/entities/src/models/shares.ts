import { z } from "zod";
import { ShareType } from "../constants";

export const ShareSchema = z.object({
  id: z.string().uuid().nonempty(),
  collection_id: z.string().uuid().nonempty(),
  shared_with: z.string().uuid().nonempty(),
  shared_by: z.string().uuid().nonempty(),
  share_type: z.enum([ShareType.Deep, ShareType.Shallow]),
});

export type Share = z.infer<typeof ShareSchema>;
export type ShareInsert = Omit<Share, "id">;
export type ShareUpdate = Partial<
  Omit<Share, "id" | "shared_by" | "collection_id">
>;
