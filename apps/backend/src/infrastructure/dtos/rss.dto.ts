export class RSSDTO {
  private readonly _title: string;
  private readonly _published_date: string;
  private readonly _link: string;

  constructor(title: string, publishedDate: string, link: string) {
    this._title = title;
    this._link = link;
    this._published_date = publishedDate;
  }

  public get title() {
    return this._title;
  }

  public get link() {
    return this._link;
  }

  public get published_date() {
    return this._published_date;
  }

  public static fromObject(obj: any): RSSDTO {
    return new RSSDTO(obj.title, obj.published_date, obj.link);
  }

  public toObject() {
    return {
      title: this._title ?? "",
      link: this._link ?? "",
      published_date: this._published_date ?? "",
    };
  }
}
