import {
  LinkSchema,
  type Link,
  type LinkInsert,
} from "@onelink/entities/models";
import type ILinksService from "../../application/services/links.interface";
import { LinksRepository } from "../repositories/links.repository";
import { LinkDTO } from "../dtos/links.dto";
import { DatabaseOperationError } from "@onelink/entities/errros";
import { Scraper } from "@onelink/scraper";
export default class LinkService implements ILinksService {
  constructor(private readonly linkRepository = new LinksRepository()) {}

  async getAllChildLinks(
    parentId: string | null,
    ownerId: string,
  ): Promise<Link[] | undefined> {
    const getLinkSchema = LinkSchema.pick({
      owner_id: true,
      parent_id: true,
    });
    const data = getLinkSchema.parse({
      parent_id: parentId,
      owner_id: ownerId,
    });
    const links = await this.linkRepository.getAllLinksOfCollection(
      data.parent_id,
      data.owner_id,
    );

    if (!links) return undefined;

    return links.map((link) => LinkDTO.fromObject(link).toObject());
  }

  async createLink(link: LinkInsert): Promise<Link> {
    const scraper = new Scraper(link.link);
    const data = LinkSchema.omit({ id: true }).parse(link);
    const content = await scraper.scrape();
    const metadata = await scraper.extractMetadata(content);
    const newLink = await this.linkRepository.createLink(
      LinkDTO.toDB(data, metadata),
    );
    if (!newLink) {
      throw new DatabaseOperationError("Cannot create link");
    }
    const linkDTO = LinkDTO.fromObject(newLink);
    return linkDTO.toObject();
  }
}
