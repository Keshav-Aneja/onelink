import { Provider } from "@onelink/entities";
import type { User, UserInsert } from "@onelink/entities/models";

export class UserDTO {
  private _id: number;
  private _name: string;
  private _email: string;
  private _provider: Provider;
  private _provider_id: string;
  private _profile_url: string;

  constructor(
    id: number,
    name: string,
    email: string,
    provider: Provider,
    provider_id: string,
    profile_url: string,
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._profile_url = profile_url;
    this._provider = provider;
    this._provider_id = provider_id;
  }

  public get id() {
    return this._id;
  }
  public get email() {
    return this._email;
  }
  public get name() {
    return this._name;
  }
  public get profile_url() {
    return this._profile_url;
  }
  public get provider_id() {
    return this._provider_id;
  }
  public get provider() {
    return this._provider;
  }

  static fromDb(data: User): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      provider: data.provider,
      provider_id: data.provider_id,
      profile_url: data.profile_url,
    };
  }

  static fromGoogleAuth(data: any): UserInsert {
    return {
      email: data.email,
      profile_url: data.picture ?? "",
      name: data.name,
      provider: Provider.Google,
      provider_id: data.sub,
    };
  }
}
