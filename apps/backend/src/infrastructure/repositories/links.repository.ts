import db from "@onelink/db";
import type { ILinkRepository } from "../../application/repositories/links.repository.interface";
import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";
import { DatabaseOperationError } from "@onelink/entities/errros";
import logger from "../../helpers/logger";
import { LinkSearchQueryBuilder, type SearchFilters } from "../search/link-search-query.builder";

export class LinksRepository implements ILinkRepository {
  async getLinkById(
    link_id: string,
    owner_id: string,
  ): Promise<Link | undefined> {
    const [link] = await db("links")
      .where({ owner_id, id: link_id })
      .select("*");
    return link;
  }
  async getAllLinks(owner_id: string): Promise<Link[] | undefined> {
    const links = await db("links").where({ owner_id }).select("*");
    return links;
  }
  async getAllLinksOfCollection(
    parent_id: string | null,
    owner_id: string,
    requestQuery: Record<string, any>,
  ): Promise<Link[] | undefined> {
    const ALLOWED_FILTER_KEYS = new Set(["is_starred", "subscribed"]);
    const dbParams: Record<string, any> = {};
    for (const key of ALLOWED_FILTER_KEYS) {
      if (key in requestQuery) {
        dbParams[key] = requestQuery[key];
      }
    }
    if (!requestQuery["is_starred"]) {
      dbParams["parent_id"] = parent_id;
    }
    dbParams["owner_id"] = owner_id;
    const links = await db("links")
      .where({ ...dbParams })
      .select("*");
    return links;
  }
  async createLink(data: LinkInsert): Promise<Link> {
    const [link] = await db("links").insert(data).returning("*");
    if (!link) {
      throw new DatabaseOperationError("Cannot create link");
    }
    return link;
  }
  async deleteLink(link_id: string, owner_id: string): Promise<string> {
    const [link] = await db("links")
      .where({ id: link_id, owner_id })
      .delete()
      .returning("id");
    if (!link?.id) {
      throw new DatabaseOperationError("Cannot delete link");
    }
    return link.id;
  }
  async getRSSLinks(
    owner_id: string,
  ): Promise<Array<Pick<Link, "rss" | "link">> | undefined> {
    const rssLinks = await db("links")
      .where({ owner_id, subscribed: true })
      .whereNot("rss", "")
      .select("rss", "link");

    return rssLinks;
  }
  async updateLink(
    owner_id: string,
    link_id: string,
    data: Partial<LinkUpdate>,
  ): Promise<Link> {
    const [updatedLink] = await db("links")
      .where({ owner_id, id: link_id })
      .update(data)
      .returning("*");
    if (!updatedLink) {
      throw new DatabaseOperationError("Failed to update link");
    }
    return updatedLink;
  }
  async getStarredLinks(owner_id: string): Promise<Link[] | undefined> {
    const links = await db("links")
      .where({ owner_id, is_starred: true })
      .orderBy("created_at", "desc");

    return links;
  }
  async getLinksCountByCollection(
    owner_id: string,
    parent_id: string | null,
  ): Promise<number> {
    const [links]: Array<Record<string, any>> = await db("links")
      .where({ owner_id, parent_id })
      .count("id as count");

    if (!links) {
      return 0;
    }
    return parseInt(links["count"]);
  }

  async getSearchLinks(owner_id: string, search_query: string, filters?: SearchFilters): Promise<Link[] | undefined> {
    const base = db("links").select("links.*").where("links.owner_id", owner_id);
    return LinkSearchQueryBuilder.apply(base, search_query, filters);
  }

  async deleteLinksByParentIds(parent_ids: string[], owner_id: string): Promise<void> {
    if (parent_ids.length === 0) return;
    await db("links").whereIn("parent_id", parent_ids).where({ owner_id }).delete();
  }

  async getLinksByParentId(parent_id: string): Promise<Link[]> {
    return db("links").where({ parent_id }).select("*");
  }
}
