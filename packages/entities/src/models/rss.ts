import { z } from "zod";

export const RSSInputSchema = z.object({
  owner_id: z.string().uuid(),
  sinceDays: z.coerce.number().min(0).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).refine(
  (data) => data.sinceDays !== undefined || (data.startDate !== undefined && data.endDate !== undefined),
  {
    message: "Either sinceDays or both startDate and endDate must be provided",
  }
);

export type RSSInputType = z.infer<typeof RSSInputSchema>;

export type RSSFeed = {
  title?: string;
  published_date?: string;
  link?: string;
};
