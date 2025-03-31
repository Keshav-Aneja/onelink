import fs from "fs";

export function extractBookmarkData() {
  fs.readFile("./test.html", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const bookmark = new Bookmark(data.toString("utf-8"));
    console.log(bookmark.extractMetadata());
    console.log(JSON.stringify(bookmark.extractStructure(), null, 2));
    return bookmark.extractMetadata();
  });
}

extractBookmarkData();

type FolderMeta = {
  name: string;
  attributes: string;
};

type Meta = {
  title: string | undefined;
  folders: FolderMeta[];
};

type BookmarkItem = {
  title: string;
  url: string;
  attributes: string;
};

type BookmarkFolder = {
  name: string;
  attributes: string;
  items: BookmarkItem[];
  folders: BookmarkFolder[];
};

type BookmarkStructure = {
  title: string | undefined;
  rootFolders: BookmarkFolder[];
};

export default class Bookmark {
  private _data: string;

  constructor(data: string) {
    this._data = data;
  }

  extractMetadata(): Meta {
    const validType = this._data.includes(
      "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    );
    const meta: Meta = { title: undefined, folders: [] };

    if (validType) {
      // Extract <TITLE>
      const titleMatch = this._data.match(/<TITLE>(.*?)<\/TITLE>/i);
      if (titleMatch) {
        meta.title = titleMatch[1];
      }

      // Extract all <H3> folders and attributes
      const folderMatches = this._data.match(/<H3[^>]*>.*?<\/H3>/gi);
      if (folderMatches) {
        meta.folders = folderMatches.map((tag) =>
          this.findAttributesAndChild(tag),
        );
      }
    }

    return meta;
  }

  findAttributesAndChild(tag: string): FolderMeta {
    // Regex to capture attributes inside <H3> and the text content
    const regex = /<H3(?<attributes>[^>]*)>(?<text>.*?)<\/H3>/i;
    const match = tag.match(regex);

    if (!match || !match.groups) return { name: "", attributes: "" };

    // Extract attributes
    const attributes: Record<string, string> = {};
    const attrRegex = /(\w+)="(.*?)"/g;
    let attrMatch;
    while (
      (attrMatch = attrRegex.exec(match.groups.attributes || "")) !== null
    ) {
      if (attrMatch[1] && attrMatch[2]) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
    }

    return {
      name:
        match.groups.text?.trim() || `Bookmarks-${new Date().toDateString()}`, // Folder name
      attributes: JSON.stringify(attributes), // Extracted attributes
    };
  }

  extractStructure(): BookmarkStructure {
    const validType = this._data.includes(
      "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    );
    const structure: BookmarkStructure = { title: undefined, rootFolders: [] };

    if (!validType) return structure;

    // Extract <TITLE>
    const titleMatch = this._data.match(/<TITLE>(.*?)<\/TITLE>/i);
    if (titleMatch) {
      structure.title = titleMatch[1];
    }

    // Find the root DL element
    const rootDLMatch = this._data.match(/<DL><p>([\s\S]*?)<\/DL><p>/);
    if (rootDLMatch && rootDLMatch[1]) {
      structure.rootFolders = this.parseFolderContent(rootDLMatch[1]);
    }

    return structure;
  }

  private parseFolderContent(content: string): BookmarkFolder[] {
    const folders: BookmarkFolder[] = [];

    // Match all folder sections (H3 followed by DL)
    const folderRegex =
      /<DT><H3([^>]*)>(.*?)<\/H3>\s*<DL><p>([\s\S]*?)<\/DL><p>/g;
    let folderMatch;

    while ((folderMatch = folderRegex.exec(content)) !== null) {
      const folderAttributes = this.extractAttributes(folderMatch[1] || "");
      const folderName =
        folderMatch[2]?.trim() || `Unnamed Folder ${new Date().toDateString()}`;
      const folderContent = folderMatch[3];

      const folder: BookmarkFolder = {
        name: folderName,
        attributes: JSON.stringify(folderAttributes),
        items: [],
        folders: [],
      };

      const itemRegex = /<DT><A([^>]*)>(.*?)<\/A>/g;
      let itemMatch;

      while ((itemMatch = itemRegex.exec(folderContent || "")) !== null) {
        const itemAttributes = this.extractAttributes(itemMatch[1] as string);
        const url = itemAttributes.HREF || "";
        delete itemAttributes.HREF;

        folder.items.push({
          title: itemMatch[2]?.trim() || "Link",
          url,
          attributes: JSON.stringify(itemAttributes),
        });
      }

      folder.folders = this.parseFolderContent(folderContent || "");

      folders.push(folder);
    }

    return folders;
  }

  private extractAttributes(attributeString: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    const attrRegex = /(\w+)="(.*?)"/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attributeString)) !== null) {
      if (attrMatch[1] && attrMatch[2]) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
    }

    return attributes;
  }
}
