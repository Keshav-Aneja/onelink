import { z } from "zod";

export const LinkSchema = z.object({
  id: z.string().uuid().nonempty(),
  name: z.string().optional(),
  description: z.string().optional(),
  fingerprint: z.string(),
  link: z.string().url(),
  open_graph: z.string().optional(),
  rss: z.string().optional(),
  author: z.string().optional(),
  site_description: z.string().optional(),
  keywords: z.string().optional(),
  is_starred: z.boolean().default(false),
  owner_id: z.string().uuid().nonempty(),
  parent_id: z.string().nullable(),
  subscribed: z.boolean().default(false).optional(),
});

export type Link = z.infer<typeof LinkSchema>;
export type LinkInsert = Omit<Link, "id">;
export type LinkUpdate = Partial<Omit<Link, "id" | "owner_id">>;
