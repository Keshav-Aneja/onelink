import type { CollectionInsert } from "@onelink/entities/models";

export class CollectionDTO {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _color: string;
  private readonly _description: string;
  private readonly _is_protected: boolean;
  private readonly _password: string;
  private readonly _parent_id: string | null;
  private readonly _owner_id: string;

  constructor(
    id: string,
    name: string,
    color: string,
    description: string,
    isProtected: boolean,
    password: string,
    parentId: string | null,
    ownerId: string,
  ) {
    this._id = id;
    this._name = name;
    this._color = color;
    this._description = description;
    this._is_protected = isProtected;
    this._password = password;
    this._owner_id = ownerId;
    this._parent_id = parentId;
  }

  // Getters
  public get id() {
    return this._id;
  }
  public get name() {
    return this._name;
  }
  public get color() {
    return this._color;
  }
  public get description() {
    return this._description;
  }
  public get isProtected() {
    return this._is_protected;
  }
  public get password() {
    return this._password;
  }
  public get parentId() {
    return this._parent_id;
  }
  public get ownerId() {
    return this._owner_id;
  }

  public static toDB(obj: CollectionInsert) {
    return {
      name: obj.name,
      color: obj.color,
      description: obj.description ?? "",
      is_protected: obj.is_protected ?? false,
      password: obj.password ?? "",
      parent_id: obj.parent_id,
      owner_id: obj.owner_id,
    };
  }

  public static fromObject(obj: any): CollectionDTO {
    return new CollectionDTO(
      obj.id,
      obj.name,
      obj.color,
      obj.description,
      obj.is_protected,
      obj.password,
      obj.parent_id ?? null,
      obj.owner_id,
    );
  }

  public toObject() {
    return {
      id: this._id,
      name: this._name,
      color: this._color,
      description: this._description,
      is_protected: this._is_protected,
      // password: this._password,
      parent_id: this._parent_id,
      owner_id: this._owner_id,
    };
  }
}
