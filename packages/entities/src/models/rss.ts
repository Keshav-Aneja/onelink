import { z } from "zod";

export const RSSInputSchema = z.object({
  owner_id: z.string().uuid(),
  sinceDays: z.coerce.number().min(0),
});

export type RSSInputType = z.infer<typeof RSSInputSchema>;

export type RSSFeed = {
  title?: string;
  published_date?: string;
  link?: string;
};
