import { ActionResponse } from "@onelink/action";
import type { Request, Response } from "express";
import CollectionsService from "../../infrastructure/services/collections.service";
import { asyncHandler } from "../../helpers/async-handler";
import LinkService from "../../infrastructure/services/links.service";
import { pathParam } from "../../helpers/request";

const collectionsService = new CollectionsService();
const linkService = new LinkService();

export class CollectionAdapter {
  static createCollection = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const collection = await collectionsService.createCollection({
        ...req.body,
        owner_id: req.session.user_id,
      });
      ActionResponse.success(res, collection, 201, "Collection created");
    },
  );

  static getCollections = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const collectionId = pathParam(req, "id") ?? null;
      const collections = await collectionsService.getAllChildCollections(
        collectionId,
        req.session.user_id ?? "",
      );
      ActionResponse.success(res, collections, 200, "Collections fetched successfully");
    },
  );

  static getCollectionStats = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const collectionId = pathParam(req, "id") ?? null;
      const user_id = req.session.user_id!;
      const [collectionsCount, linksCount] = await Promise.all([
        collectionsService.getCollectionsCount(user_id, collectionId),
        linkService.getLinksCount(user_id, collectionId),
      ]);
      ActionResponse.success(res, { collections: collectionsCount, links: linksCount }, 200, "Collection stats fetched");
    },
  );

  static verifyPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const collectionId = pathParam(req, "id") ?? null;
      const { password } = req.body;
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
      const id = pathParam(req, "id");
      if (!id) {
        ActionResponse.error(res, "Collection ID is required", 400);
        return;
      }
      const result = await collectionsService.deleteCollection(id, req.session.user_id!);
      ActionResponse.success(res, result, 200, "Collection and all its contents deleted successfully");
    },
  );
}
