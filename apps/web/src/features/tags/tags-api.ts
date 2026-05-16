import action from "@config/action";
import { Link, Tag } from "@onelink/entities/models";
import { IActionResponse } from "@onelink/action";

export const getAllTags = (): Promise<IActionResponse<Array<Tag & { link_count: number }>>> =>
  action.get("/tags");

export const getLinksByTag = (tagName: string): Promise<IActionResponse<Link[]>> =>
  action.get(`/tags/links/${encodeURIComponent(tagName)}`);

export const getTagsForLink = (linkId: string): Promise<IActionResponse<Tag[]>> =>
  action.get(`/tags/${linkId}`);

export const addTagToLink = (linkId: string, name: string): Promise<IActionResponse<Tag>> =>
  action.post(`/tags/${linkId}`, { name });

export const confirmTag = (linkId: string, tagId: string): Promise<IActionResponse<void>> =>
  action.patch(`/tags/${linkId}/${tagId}`, {});

export const removeTag = (linkId: string, tagId: string): Promise<IActionResponse<void>> =>
  action.delete(`/tags/${linkId}/${tagId}`);
