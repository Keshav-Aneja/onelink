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
  item_hash?: string;
  feed_id?: string;
};

export const RssSubscriptionSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  feed_url: z.string().url(),
  site_url: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  link_id: z.string().uuid().nullable().optional(),
  last_fetched_at: z.coerce.date().nullable().optional(),
  last_error: z.string().nullable().optional(),
  created_at: z.coerce.date().optional(),
});

export type RssSubscription = z.infer<typeof RssSubscriptionSchema>;

export type RssSubscriptionInsert = Pick<RssSubscription, "owner_id" | "feed_url"> &
  Partial<Pick<RssSubscription, "site_url" | "title" | "favicon_url" | "link_id">>;

export type RssSubscriptionWithUnread = RssSubscription & { unread_count: number };

export const RssReadItemSchema = z.object({
  owner_id: z.string().uuid(),
  item_hash: z.string(),
  read_at: z.coerce.date().optional(),
});

export const RssDiscoveryQueueSchema = z.object({
  id: z.string().uuid(),
  link_id: z.string().uuid(),
  owner_id: z.string().uuid(),
  created_at: z.coerce.date(),
  processed_at: z.coerce.date().nullable(),
});

export type RssDiscoveryQueue = z.infer<typeof RssDiscoveryQueueSchema>;

export type RssDiscoveryQueueInsert = Pick<RssDiscoveryQueue, "link_id" | "owner_id">;
