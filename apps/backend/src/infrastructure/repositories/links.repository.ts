import db from "@onelink/db";
import type { ILinkRepository } from "../../application/repositories/links.repository.interface";
import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";
import { DatabaseOperationError } from "@onelink/entities/errros";

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
  ): Promise<Link[] | undefined> {
    const links = await db("links").where({ owner_id, parent_id }).select("*");
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
      .where({ owner_id })
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
}
