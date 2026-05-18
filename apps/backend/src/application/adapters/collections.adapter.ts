import { ActionResponse } from "@onelink/action";
import type { Request, Response } from "express";
import CollectionsService from "../../infrastructure/services/collections.service";
import { asyncHandler } from "../../helpers/async-handler";
import LinkService from "../../infrastructure/services/links.service";
import logger from "../../helpers/logger";

const collectionsService = new CollectionsService();
const linkService = new LinkService();

export class CollectionAdapter {
  static createCollection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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
      const id = typeof req.params["id"] === "string" ? req.params["id"] : undefined;
      const collectionId = id ? id : null;
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
      const id = typeof req.params["id"] === "string" ? req.params["id"] : undefined;
      const collectionId = id ? id : null;
      const user_id = req.session.user_id!;
      const [collectionsCount, linksCount] = await Promise.all([
        collectionsService.getCollectionsCount(user_id, collectionId),
        linkService.getLinksCount(user_id, collectionId),
      ]);
      const data = { collections: collectionsCount, links: linksCount };
      ActionResponse.success(res, data, 200, "Collection stats fetched");
    },
  );

  static verifyPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const id = typeof req.params["id"] === "string" ? req.params["id"] : undefined;
      const { password } = req.body;
      const collectionId = id ? id : null;
      const verified = await collectionsService.verifyPassword(
        collectionId,
        req.session.user_id!,
        password,
      );
      ActionResponse.success(res, { verified }, 200, "Verification complete");
    },
  );

  static deleteCollection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const id = typeof req.params["id"] === "string" ? req.params["id"] : undefined;
      if (!id) {
        ActionResponse.error(res, "Collection ID is required", 400);
        return;
      }
      const result = await collectionsService.deleteCollection(
        id,
        req.session.user_id!,
      );
      ActionResponse.success(
        res,
        result,
        200,
        "Collection and all its contents deleted successfully",
      );
    },
  );
}
