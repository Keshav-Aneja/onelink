import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import FeedsService from "../../infrastructure/services/feeds.service";
import { ActionResponse } from "@onelink/action";

export default class FeedsAdapter {
  static getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const service = new FeedsService();
    const subs = await service.getSubscriptions(req.session.user_id!);
    ActionResponse.success(res, subs, 200, "Subscriptions fetched");
  });

  static subscribe = asyncHandler(async (req: Request, res: Response) => {
    const { url, link_id } = req.body;
    if (!url) {
      ActionResponse.error(res, "url is required", 400, undefined);
      return;
    }
    const service = new FeedsService();
    const sub = await service.subscribe(req.session.user_id!, url, link_id);
    ActionResponse.success(res, sub, 201, "Subscribed");
  });

  static unsubscribe = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const service = new FeedsService();
    const result = await service.unsubscribe(req.session.user_id!, id);
    ActionResponse.success(res, result, 200, "Unsubscribed");
  });

  static getFeedItems = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays, startDate, endDate, feedId } = req.body;
    const service = new FeedsService();
    const items = await service.getFeedItems(
      req.session.user_id!,
      sinceDays,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      feedId,
    );
    ActionResponse.success(res, items, 200, "Feed items fetched");
  });

  static getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays, feedId } = req.body;
    const service = new FeedsService();
    const items = await service.getFeedItemsFromCache(req.session.user_id!, sinceDays || 1, feedId);
    ActionResponse.success(res, items, 200, "Notifications fetched from cache");
  });

  static getReadHashes = asyncHandler(async (req: Request, res: Response) => {
    const service = new FeedsService();
    const hashes = await service.getReadHashes(req.session.user_id!);
    ActionResponse.success(res, hashes, 200, "Read hashes fetched");
  });

  static markRead = asyncHandler(async (req: Request, res: Response) => {
    const { item_hashes } = req.body;
    if (!Array.isArray(item_hashes)) {
      ActionResponse.error(res, "item_hashes must be an array", 400, undefined);
      return;
    }
    const service = new FeedsService();
    await service.markRead(req.session.user_id!, item_hashes);
    ActionResponse.success(res, null, 200, "Marked as read");
  });

  static markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays } = req.body;
    const service = new FeedsService();
    await service.markAllRead(req.session.user_id!, sinceDays);
    ActionResponse.success(res, null, 200, "All marked as read");
  });

  static exportOpml = asyncHandler(async (req: Request, res: Response) => {
    const service = new FeedsService();
    const opml = await service.exportOpml(req.session.user_id!);
    res.setHeader("Content-Type", "text/x-opml");
    res.setHeader("Content-Disposition", "attachment; filename=onelink-feeds.opml");
    res.status(200).send(opml);
  });

  static importOpml = asyncHandler(async (req: Request, res: Response) => {
    const { opml } = req.body;
    if (!opml || typeof opml !== "string") {
      ActionResponse.error(res, "opml XML string is required", 400, undefined);
      return;
    }
    const service = new FeedsService();
    const result = await service.importOpml(req.session.user_id!, opml);
    ActionResponse.success(res, result, 201, `Imported ${result.added} feeds`);
  });
}
