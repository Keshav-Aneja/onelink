import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import LinkService from "../../infrastructure/services/links.service";
import { ActionResponse } from "@onelink/action";

export default class LinkAdapter {
  static createLink = asyncHandler(async (req: Request, res: Response) => {
    const linkService = new LinkService();
    const data = req.body;
    const link = await linkService.createLink({
      ...data,
      owner_id: req.session.user_id,
    });
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
}
