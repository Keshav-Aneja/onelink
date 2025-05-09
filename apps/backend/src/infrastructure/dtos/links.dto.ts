import type { Link, LinkInsert } from "@onelink/entities/models";
import type { WebsiteMetadata } from "@onelink/scraper";
import { subscribe } from "node:diagnostics_channel";

export class LinkDTO {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _fingerprint: string;
  private readonly _link: string;
  private readonly _open_graph: string;
  private readonly _parent_id: string | null;
  private readonly _owner_id: string;
  private readonly _site_description: string;
  private readonly _keywords: string;
  private readonly _author: string;
  private readonly _rss: string;
  private readonly _is_starred: boolean;
  private readonly _subscribed: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    fingerprint: string,
    open_graph: string,
    link: string,
    parentId: string | null,
    ownerId: string,
    site_description: string,
    keywords: string,
    author: string,
    rss: string,
    is_starred: boolean,
    subscribed: boolean,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._fingerprint = fingerprint;
    this._link = link;
    this._open_graph = open_graph;
    this._parent_id = parentId;
    this._owner_id = ownerId;
    this._site_description = site_description;
    this._author = author;
    this._keywords = keywords;
    this._rss = rss;
    this._is_starred = is_starred;
    this._subscribed = subscribed;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get fingerprint(): string {
    return this._fingerprint;
  }

  get link(): string {
    return this._link;
  }

  get parentId(): string | null {
    return this._parent_id;
  }

  get ownerId(): string {
    return this._owner_id;
  }

  get openGraph(): string {
    return this._open_graph;
  }

  get siteDescription(): string {
    return this._site_description;
  }

  get author(): string {
    return this._author;
  }

  get rss(): string {
    return this._rss;
  }

  get keywords(): string {
    return this._keywords;
  }

  get isStarred(): boolean {
    return this._is_starred;
  }

  get subscribed(): boolean {
    return this._subscribed;
  }

  static formatLink(link: string, path: string | undefined) {
    if (!path) {
      return;
    }

    const url = new URL(link);
    const origin = url.origin;

    if (/^https?:\/\//.test(path)) {
      return path;
    }

    // Ensure path starts with a single "/"
    const formattedPath = path.startsWith("/") ? path : `/${path}`;

    return `${origin}${formattedPath}`;
  }

  public static toDB(obj: LinkInsert, metadata: WebsiteMetadata) {
    return {
      name: metadata.title || metadata.applicationName || "",
      description: obj.description ?? metadata.description,
      fingerprint: obj.fingerprint,
      parent_id: obj.parent_id,
      owner_id: obj.owner_id,
      is_starred: obj.is_starred,
      link: obj.link,
      open_graph:
        this.formatLink(obj.link, metadata.ogImage) ||
        this.formatLink(obj.link, metadata.twitterImage) ||
        this.formatLink(obj.link, metadata.favicon),
      site_description:
        metadata.description ||
        metadata.ogDescription ||
        metadata.twitterDescription ||
        "",
      keywords: metadata.keywords || "",
      author: metadata.author || "",
      rss: metadata.rssLink || "",
      subscribed: obj.subscribed,
    };
  }

  public static fromObject(obj: any): LinkDTO {
    return new LinkDTO(
      obj.id,
      obj.name,
      obj.description,
      obj.fingerprint,
      obj.open_graph,
      obj.link,
      obj.parent_id,
      obj.owner_id,
      obj.site_description,
      obj.keywords,
      obj.author,
      obj.rss,
      obj.is_starred,
      obj.subscribed,
    );
  }

  public toObject() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      link: this._link,
      open_graph: this._open_graph,
      owner_id: this._owner_id,
      parent_id: this.parentId,
      fingerprint: this._fingerprint,
      site_description: this._site_description,
      author: this._author,
      rss: this._rss,
      keywords: this._keywords,
      is_starred: this._is_starred,
      subscribed: this._subscribed,
    };
  }
}
