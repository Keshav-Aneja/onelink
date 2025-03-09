import type { Link, LinkInsert } from "@onelink/entities/models";

export default interface ILinksService {
  getAllChildLinks(
    parent_id: string | null,
    owner_id: string,
  ): Promise<Link[] | undefined>;
  createLink(link: LinkInsert): Promise<Link>;
}
