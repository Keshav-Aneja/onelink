import db from "@onelink/db";
import type { Tag } from "@onelink/entities/models";

export class TagsRepository {
  async upsertTagsForLink(
    linkId: string,
    ownerId: string,
    tagNames: string[],
    confirmed: boolean,
  ): Promise<Tag[]> {
    if (tagNames.length === 0) return [];

    const results: Tag[] = [];

    for (const name of tagNames) {
      const [tag] = await db("tags")
        .insert({ name, owner_id: ownerId, is_auto: !confirmed })
        .onConflict(["name", "owner_id"])
        .merge({ updated_at: db.fn.now() })
        .returning("*");

      await db("link_tags")
        .insert({ link_id: linkId, tag_id: tag.id, confirmed })
        .onConflict(["link_id", "tag_id"])
        .merge({ confirmed });

      results.push({ ...tag, confirmed });
    }

    return results;
  }

  async getTagsForLink(linkId: string): Promise<Tag[]> {
    return db("tags")
      .join("link_tags", "tags.id", "link_tags.tag_id")
      .where("link_tags.link_id", linkId)
      .select("tags.*", "link_tags.confirmed");
  }

  async getAllTagsForOwner(
    ownerId: string,
  ): Promise<Array<Tag & { link_count: number }>> {
    return db("tags")
      .leftJoin("link_tags", "tags.id", "link_tags.tag_id")
      .where("tags.owner_id", ownerId)
      .groupBy("tags.id")
      .select("tags.*")
      .count("link_tags.link_id as link_count")
      .orderBy("link_count", "desc") as any;
  }

  async confirmTag(linkId: string, tagId: string): Promise<void> {
    await db("link_tags")
      .where({ link_id: linkId, tag_id: tagId })
      .update({ confirmed: true });
  }

  async removeTagFromLink(linkId: string, tagId: string): Promise<void> {
    await db("link_tags").where({ link_id: linkId, tag_id: tagId }).delete();
  }

  async getTagsForLinks(linkIds: string[]): Promise<
    Array<Tag & { link_id: string }>
  > {
    if (linkIds.length === 0) return [];
    return db("tags")
      .join("link_tags", "tags.id", "link_tags.tag_id")
      .whereIn("link_tags.link_id", linkIds)
      .select("tags.*", "link_tags.confirmed", "link_tags.link_id");
  }

  async getLinksByTag(
    ownerId: string,
    tagName: string,
  ): Promise<Array<any>> {
    return db("links")
      .join("link_tags", "links.id", "link_tags.link_id")
      .join("tags", "tags.id", "link_tags.tag_id")
      .where("links.owner_id", ownerId)
      .where("tags.name", tagName)
      .select("links.*");
  }
}
