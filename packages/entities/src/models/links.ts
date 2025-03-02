import { z } from "zod";

export const LinkSchema = z.object({
  id: z.string().uuid().nonempty(),
  name: z.string(),
  description: z.string().optional(),
  fingerprint: z.string().nanoid(),
  link: z.string().url(),
  open_graph: z.string().optional(),

  owner_id: z.string().uuid().nonempty(),
  parent_id: z.string().nullable(),
});

export type Link = z.infer<typeof LinkSchema>;
export type LinkUpdate = Partial<Pick<Link, "id" | "owner_id">>;
