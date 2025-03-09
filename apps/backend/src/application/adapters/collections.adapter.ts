import { ActionResponse } from "@onelink/action";
import type { Request, Response } from "express";
import CollectionsService from "../../infrastructure/services/collections.service";
import { asyncHandler } from "../../helpers/async-handler";

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
}
