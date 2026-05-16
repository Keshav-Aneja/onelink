import { ActionResponse } from "@onelink/action";
import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { PublicSharesService } from "../../infrastructure/services/public-shares.service";
import { ShareType } from "@onelink/entities";

export class PublicShareAdapter {
  static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { collection_id, share_type } = req.body;
    if (!collection_id) {
      ActionResponse.error(res, "collection_id is required", 400);
      return;
    }
    const service = new PublicSharesService();
    const share = await service.createShare(
      req.session.user_id!,
      collection_id,
      share_type ?? ShareType.Shallow,
    );
    ActionResponse.success(res, share, 201, "Public share created");
  });

  static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const share_id = req.params["share_id"] as string;
    if (!share_id) { ActionResponse.error(res, "share_id is required", 400); return; }
    const service = new PublicSharesService();
    const share = await service.updateShare(share_id, req.session.user_id!, req.body);
    ActionResponse.success(res, share, 200, "Public share updated");
  });

  static delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const share_id = req.params["share_id"] as string;
    if (!share_id) { ActionResponse.error(res, "share_id is required", 400); return; }
    const service = new PublicSharesService();
    await service.deleteShare(share_id, req.session.user_id!);
    ActionResponse.success(res, { id: share_id }, 200, "Public share deleted");
  });

  static getForCollection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const collection_id = req.params["collection_id"] as string;
    if (!collection_id) { ActionResponse.error(res, "collection_id is required", 400); return; }
    const service = new PublicSharesService();
    const share = await service.getForCollection(collection_id, req.session.user_id!);
    ActionResponse.success(res, share, 200, "Public share fetched");
  });

  static resolve = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const token = req.params["token"] as string;
    if (!token) { ActionResponse.error(res, "token is required", 400); return; }
    const service = new PublicSharesService();
    const data = await service.resolvePublicShare(token);
    ActionResponse.success(res, data, 200, "Public collection resolved");
  });
}
