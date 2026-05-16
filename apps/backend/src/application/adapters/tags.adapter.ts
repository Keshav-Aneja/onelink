import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { TagsRepository } from "../../infrastructure/repositories/tags.repository";
import { LinkDTO } from "../../infrastructure/dtos/links.dto";
import { ActionResponse } from "@onelink/action";

const tagsRepo = new TagsRepository();

export default class TagsAdapter {
  static getAllTags = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.session.user_id!;
    const tags = await tagsRepo.getAllTagsForOwner(ownerId);
    ActionResponse.success(res, tags, 200, "Tags fetched");
  });

  static getTagsForLink = asyncHandler(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    const tags = await tagsRepo.getTagsForLink(linkId);
    ActionResponse.success(res, tags, 200, "Tags fetched");
  });

  static getLinksByTag = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.session.user_id!;
    const { tagName } = req.params;
    const links = await tagsRepo.getLinksByTag(ownerId, tagName);
    const linkIds = links.map((l: any) => l.id);
    const allTags = await tagsRepo.getTagsForLinks(linkIds);
    const tagsByLink = new Map<string, typeof allTags>();
    for (const tag of allTags) {
      const arr = tagsByLink.get(tag.link_id) ?? [];
      arr.push(tag);
      tagsByLink.set(tag.link_id, arr);
    }
    const result = links.map((link: any) => {
      const obj = LinkDTO.fromObject(link).toObject();
      obj.tags = tagsByLink.get(link.id) ?? [];
      return obj;
    });
    ActionResponse.success(res, result, 200, "Links fetched");
  });

  static addTagToLink = asyncHandler(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    const ownerId = req.session.user_id!;
    const { name } = req.body as { name: string };
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      ActionResponse.error(res, "Tag name is required", 400, undefined);
      return;
    }
    const normalized = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 40);
    const tags = await tagsRepo.upsertTagsForLink(linkId, ownerId, [normalized], true);
    ActionResponse.success(res, tags[0], 201, "Tag added");
  });

  static confirmTag = asyncHandler(async (req: Request, res: Response) => {
    const { linkId, tagId } = req.params;
    await tagsRepo.confirmTag(linkId, tagId);
    ActionResponse.success(res, { linkId, tagId }, 200, "Tag confirmed");
  });

  static removeTag = asyncHandler(async (req: Request, res: Response) => {
    const { linkId, tagId } = req.params;
    await tagsRepo.removeTagFromLink(linkId, tagId);
    ActionResponse.success(res, { linkId, tagId }, 200, "Tag removed");
  });
}
