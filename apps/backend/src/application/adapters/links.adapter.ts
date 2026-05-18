import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import LinkService from "../../infrastructure/services/links.service";
import { ActionResponse } from "@onelink/action";
import logger from "../../helpers/logger";
import { formatGetQueries, type GetLinksQuery } from "../../helpers/format-query";
import { RssDiscoveryQueueRepository } from "../../infrastructure/repositories/rss-discovery-queue.repository";
import { pathParam } from "../../helpers/request";

const linkService = new LinkService();
const rssQueueRepo = new RssDiscoveryQueueRepository();

export default class LinkAdapter {
  static createLink = asyncHandler(async (req: Request, res: Response) => {
    const { notification, ...data } = req.body;
    const link = await linkService.createLink({
      ...data,
      owner_id: req.session.user_id,
    });
    if (notification) {
      await rssQueueRepo.addToQueue({
        link_id: link.id,
        owner_id: link.owner_id,
      });
    }
    ActionResponse.success(res, link, 201, "Link created");
  });

  static getLinks = asyncHandler(async (req: Request, res: Response) => {
    const collectionId = pathParam(req, "id") ?? null;
    const requestQuery: GetLinksQuery = formatGetQueries(req.query as Record<string, string>);
    const links = await linkService.getAllChildLinks(
      collectionId,
      req.session.user_id ?? "",
      requestQuery,
    );
    ActionResponse.success(res, links, 200, "Links fetched successfully");
  });

  static getUpdatedFeed = asyncHandler(async (req: Request, res: Response) => {
    const { sinceDays, startDate, endDate } = req.body;
    const feed = await linkService.getRSSFeed(
      req.session.user_id ?? "",
      sinceDays,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    ActionResponse.success(res, feed, 200, "Feed fetched successfully");
  });

  static updateLink = asyncHandler(async (req: Request, res: Response) => {
    const id = pathParam(req, "id") ?? "";
    const link = await linkService.updateLink(req.session.user_id!, id, req.body);
    ActionResponse.success(res, link, 200, "Link updated");
  });

  static getStarredLinks = asyncHandler(async (req: Request, res: Response) => {
    const links = await linkService.getStarredLinks(req.session.user_id!);
    ActionResponse.success(res, links, 200, "Starred links fetched successfully");
  });

  static deleteLink = asyncHandler(async (req: Request, res: Response) => {
    const id = pathParam(req, "id") ?? "";
    const deletedId = await linkService.deleteLink(req.session.user_id!, id);
    ActionResponse.success(res, deletedId, 200, "Link Deleted");
  });

  static searchLinks = asyncHandler(async (req: Request, res: Response) => {
    const { q: search_query, collection_id, tag, starred } = req.query;
    if (typeof search_query !== "string" || search_query.length === 0) {
      ActionResponse.error(res, "Invalid search query", 400, undefined);
      return;
    }

    const filters = {
      ...(collection_id !== undefined && {
        collection_id: typeof collection_id === "string" ? collection_id : null,
      }),
      ...(typeof tag === "string" && tag.length > 0 && { tag }),
      ...(starred === "true" && { starred: true }),
    };

    const queriedLinks = await linkService.searchLinks(
      req.session.user_id!,
      search_query,
      Object.keys(filters).length > 0 ? filters : undefined,
    );
    ActionResponse.success(res, queriedLinks, 200, "Links fetched successfully");
  });
}
