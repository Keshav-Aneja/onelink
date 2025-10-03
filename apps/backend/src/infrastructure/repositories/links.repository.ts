import db from "@onelink/db";
import type { ILinkRepository } from "../../application/repositories/links.repository.interface";
import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";
import { DatabaseOperationError } from "@onelink/entities/errros";
import logger from "../../helpers/logger";

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
    const dbParams = { ...requestQuery };
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
    console.log(data);
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

  async getSearchLinks(search_query: string): Promise<Link[] | undefined> {
    await db.raw("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    const links = await db("links")
      .select("*")
      .where(function () {
        this.whereILike("name", `%${search_query}%`)
          .orWhereILike("description", `%${search_query}%`)
          .orWhereILike("site_description", `%${search_query}%`)
          .orWhereILike("keywords", `%${search_query}%`)
          .orWhereRaw("similarity(name, ?::text) > 0.2", [search_query])
          .orWhereRaw("similarity(description, ?::text) > 0.2", [search_query])
          .orWhereRaw("similarity(site_description, ?::text) > 0.2", [
            search_query,
          ])
          .orWhereRaw("similarity(keywords, ?::text) > 0.2", [search_query]);
      })
      .orderByRaw(
        `
      GREATEST(
        similarity(name, ?::text),
        similarity(description, ?::text),
        similarity(keywords, ?::text),
        similarity(site_description, ?::text)
      ) DESC
      `,
        [search_query, search_query, search_query, search_query],
      );

    return links;
  }
}
