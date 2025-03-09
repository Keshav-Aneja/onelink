import type { Link, LinkInsert } from "@onelink/entities/models";

export class LinkDTO {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _fingerprint: string;
  private readonly _link: string;
  private readonly _open_graph: string;
  private readonly _parent_id: string | null;
  private readonly _owner_id: string;

  constructor(
    id: string,
    name: string,
    description: string,
    fingerprint: string,
    open_graph: string,
    link: string,
    parentId: string | null,
    ownerId: string,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._fingerprint = fingerprint;
    this._link = link;
    this._open_graph = open_graph;
    this._parent_id = parentId;
    this._owner_id = ownerId;
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

  public static toDB(obj: LinkInsert) {
    return {
      name: obj.name ?? "",
      description: obj.description ?? "",
      fingerprint: obj.fingerprint,
      parent_id: obj.parent_id,
      owner_id: obj.owner_id,
      link: obj.link,
      open_graph: obj.open_graph ?? "",
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
    };
  }
}
