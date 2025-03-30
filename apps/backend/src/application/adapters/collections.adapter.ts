import { ActionResponse } from "@onelink/action";
import type { Request, Response } from "express";
import CollectionsService from "../../infrastructure/services/collections.service";
import { asyncHandler } from "../../helpers/async-handler";
import LinkService from "../../infrastructure/services/links.service";

export class CollectionAdapter {
  static createCollection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const collectionsService = new CollectionsService();
      const data = req.body;
      const collection = await collectionsService.createCollection({
        ...data,
        owner_id: req.session.user_id,
      });
      ActionResponse.success(res, collection, 201, "Collection created");
    },
  );

  static getCollections = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const collectionId = id ? id : null;
      const collectionsService = new CollectionsService();
      const collections = await collectionsService.getAllChildCollections(
        collectionId,
        req.session.user_id ?? "",
      );
      ActionResponse.success(
        res,
        collections,
        200,
        "Collections fetched succesfully",
      );
    },
  );

  static getCollectionStats = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const collectionId = id ? id : null;
      const collectionsService = new CollectionsService();
      const linksService = new LinkService();
      const user_id = req.session.user_id!;
      const collectionsCount = await collectionsService.getCollectionsCount(
        user_id,
        collectionId,
      );
      const linksCount = await linksService.getLinksCount(
        user_id,
        collectionId,
      );
      const data = {
        collections: collectionsCount,
        links: linksCount,
      };
      console.log("DATA", JSON.stringify(data));
      ActionResponse.success(res, data, 200, "Collection stats fetched");
    },
  );

  static verifyPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { password } = req.body;
      const collectionId = id ? id : null;
      const collectionsService = new CollectionsService();
      const verified = await collectionsService.verifyPassword(
        collectionId,
        req.session.user_id!,
        password,
      );
      ActionResponse.success(res, { verified }, 200, "Verification complete");
    },
  );
}
