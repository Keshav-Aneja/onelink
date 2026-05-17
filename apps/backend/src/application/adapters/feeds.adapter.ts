import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import FeedsService from "../../infrastructure/services/feeds.service";
import { ActionResponse } from "@onelink/action";

export default class FeedsAdapter {
  constructor(private readonly feedsService: FeedsService) {}

  getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const subs = await this.feedsService.getSubscriptions(req.session.user_id!);
    ActionResponse.success(res, subs, 200, "Subscriptions fetched");
  });

  subscribe = asyncHandler(async (req: Request, res: Response) => {
    const { url, link_id } = req.body;
    if (!url) {
      ActionResponse.error(res, "url is required", 400, undefined);
      return;
    }
    const sub = await this.feedsService.subscribe(req.session.user_id!, url, link_id);
    ActionResponse.success(res, sub, 201, "Subscribed");
  });

  unsubscribe = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const result = await this.feedsService.unsubscribe(req.session.user_id!, id);
    ActionResponse.success(res, result, 200, "Unsubscribed");
  });

  getFeedItems = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays, startDate, endDate, feedId } = req.body;
    const items = await this.feedsService.getFeedItems(
      req.session.user_id!,
      sinceDays,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      feedId,
    );
    ActionResponse.success(res, items, 200, "Feed items fetched");
  });

  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays, feedId } = req.body;
    const items = await this.feedsService.getFeedItemsFromCache(req.session.user_id!, sinceDays || 1, feedId);
    ActionResponse.success(res, items, 200, "Notifications fetched from cache");
  });

  getReadHashes = asyncHandler(async (req: Request, res: Response) => {
    const hashes = await this.feedsService.getReadHashes(req.session.user_id!);
    ActionResponse.success(res, hashes, 200, "Read hashes fetched");
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    const { item_hashes } = req.body;
    if (!Array.isArray(item_hashes)) {
      ActionResponse.error(res, "item_hashes must be an array", 400, undefined);
      return;
    }
    await this.feedsService.markRead(req.session.user_id!, item_hashes);
    ActionResponse.success(res, null, 200, "Marked as read");
  });

  markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays } = req.body;
    await this.feedsService.markAllRead(req.session.user_id!, sinceDays);
    ActionResponse.success(res, null, 200, "All marked as read");
  });

  pruneInactive = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.feedsService.pruneInactiveSubscriptions(req.session.user_id!);
    ActionResponse.success(res, result, 200, `Removed ${result.removed} inactive feed(s)`);
  });

  exportOpml = asyncHandler(async (req: Request, res: Response) => {
    const opml = await this.feedsService.exportOpml(req.session.user_id!);
    res.setHeader("Content-Type", "text/x-opml");
    res.setHeader("Content-Disposition", "attachment; filename=onelink-feeds.opml");
    res.status(200).send(opml);
  });

  importOpml = asyncHandler(async (req: Request, res: Response) => {
    const { opml } = req.body;
    if (!opml || typeof opml !== "string") {
      ActionResponse.error(res, "opml XML string is required", 400, undefined);
      return;
    }
    const result = await this.feedsService.importOpml(req.session.user_id!, opml);
    ActionResponse.success(res, result, 201, `Imported ${result.added} feeds`);
  });
}
