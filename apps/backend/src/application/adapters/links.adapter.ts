import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import LinkService from "../../infrastructure/services/links.service";
import { ActionResponse } from "@onelink/action";
import { getRedisClient } from "../../loaders/redis.loader";
import logger from "../../helpers/logger";

export default class LinkAdapter {
  static createLink = asyncHandler(async (req: Request, res: Response) => {
    const linkService = new LinkService();
    const { notification, ...data } = req.body;
    let link = await linkService.createLink({
      ...data,
      owner_id: req.session.user_id,
    });
    if (notification) {
      const rss = await linkService.findRSSFeedLink(link.link);
      if (rss) {
        link = await linkService.updateLink(link.owner_id, link.id, {
          rss,
        });
      }
    }
    ActionResponse.success(res, link, 201, "Link created");
  });

  static getLinks = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const collectionId = id ? id : null;
    const linkService = new LinkService();
    const links = await linkService.getAllChildLinks(
      collectionId,
      req.session.user_id ?? "",
    );
    ActionResponse.success(res, links, 200, "Links fetched successfully");
  });

  static getUpdatedFeed = asyncHandler(async (req: Request, res: Response) => {
    const redisClient = getRedisClient();
    const cacheKey = `feed:${req.session.user_id ?? ""}`;
    const cachedFeed = await redisClient.get(cacheKey);
    if (!cachedFeed) {
      const { sinceDays } = req.body;
      const linkService = new LinkService();
      const feed = await linkService.getRSSFeed(
        sinceDays,
        req.session.user_id ?? "",
      );
      ActionResponse.success(res, feed, 200, "New feed fetched successfully");
      await redisClient.set(cacheKey, JSON.stringify(feed), { EX: 3600 * 12 });
      //For now I am setting the expiry as 12 hours, might change later for live notifications
      return;
    }
    ActionResponse.success(
      res,
      JSON.parse(cachedFeed),
      200,
      "New feed fetched successfully",
    );
  });
}
