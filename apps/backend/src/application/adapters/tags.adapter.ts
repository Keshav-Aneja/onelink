import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { TagsRepository } from "../../infrastructure/repositories/tags.repository";
import { LinkDTO } from "../../infrastructure/dtos/links.dto";
import { ActionResponse } from "@onelink/action";
import { pathParam } from "../../helpers/request";

const tagsRepo = new TagsRepository();

export default class TagsAdapter {
  static getAllTags = asyncHandler(async (req: Request, res: Response) => {
    const tags = await tagsRepo.getAllTagsForOwner(req.session.user_id!);
    ActionResponse.success(res, tags, 200, "Tags fetched");
  });

  static getTagsForLink = asyncHandler(async (req: Request, res: Response) => {
    const linkId = pathParam(req, "linkId") ?? "";
    const tags = await tagsRepo.getTagsForLink(linkId);
    ActionResponse.success(res, tags, 200, "Tags fetched");
  });

  static getLinksByTag = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.session.user_id!;
    const tagName = pathParam(req, "tagName") ?? "";
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
    const linkId = pathParam(req, "linkId") ?? "";
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
    const linkId = pathParam(req, "linkId") ?? "";
    const tagId = pathParam(req, "tagId") ?? "";
    await tagsRepo.confirmTag(linkId, tagId);
    ActionResponse.success(res, { linkId, tagId }, 200, "Tag confirmed");
  });

  static removeTag = asyncHandler(async (req: Request, res: Response) => {
    const linkId = pathParam(req, "linkId") ?? "";
    const tagId = pathParam(req, "tagId") ?? "";
    await tagsRepo.removeTagFromLink(linkId, tagId);
    ActionResponse.success(res, { linkId, tagId }, 200, "Tag removed");
  });

  static bulkApplyTags = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.session.user_id!;
    const { link_ids, add = [], remove = [] } = req.body as {
      link_ids: string[];
      add?: string[];
      remove?: string[];
    };
    if (!Array.isArray(link_ids) || link_ids.length === 0) {
      ActionResponse.error(res, "link_ids must be a non-empty array", 400, undefined);
      return;
    }
    const normalize = (name: string) =>
      name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 40);

    const toAdd = add.map(normalize).filter(Boolean);
    const toRemove = remove.map(normalize).filter(Boolean);

    // Get tag ids for removal
    await Promise.all(
      link_ids.flatMap((linkId) => [
        toAdd.length > 0 ? tagsRepo.upsertTagsForLink(linkId, ownerId, toAdd, true) : Promise.resolve([]),
        toRemove.length > 0 ? tagsRepo.removeTagNamesFromLink(linkId, ownerId, toRemove) : Promise.resolve(),
      ]),
    );

    ActionResponse.success(res, { link_ids, added: toAdd, removed: toRemove }, 200, "Tags updated");
  });
}
