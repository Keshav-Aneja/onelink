import { z } from "zod";
import { ShareType } from "../constants";

export const PublicShareSchema = z.object({
  id: z.string().uuid(),
  token: z.string().uuid(),
  collection_id: z.string().uuid(),
  owner_id: z.string().uuid(),
  share_type: z.enum([ShareType.Deep, ShareType.Shallow]),
  is_active: z.boolean(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type PublicShare = z.infer<typeof PublicShareSchema>;
export type PublicShareInsert = Pick<PublicShare, "collection_id" | "owner_id" | "share_type">;
export type PublicShareUpdate = Partial<Pick<PublicShare, "share_type" | "is_active">>;
