import { ActionResponse } from "@onelink/action";
import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { UserSharesService } from "../../infrastructure/services/user-shares.service";
import { ShareType } from "@onelink/entities";

const userSharesService = new UserSharesService();

export class UserShareAdapter {
  static invite = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { collection_id, email, share_type } = req.body;
    if (!collection_id || !email) {
      ActionResponse.error(res, "collection_id and email are required", 400);
      return;
    }
    const share = await userSharesService.inviteByEmail(
      req.session.user_id!,
      collection_id,
      email,
      share_type ?? ShareType.Shallow,
    );
    ActionResponse.success(res, share, 201, "User invited");
  });

  static remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const share_id = req.params["share_id"] as string;
    if (!share_id) { ActionResponse.error(res, "share_id is required", 400); return; }
    const id = await userSharesService.removeInvite(share_id, req.session.user_id!);
    ActionResponse.success(res, { id }, 200, "Invite removed");
  });

  static listInvitees = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const collection_id = req.params["collection_id"] as string;
    if (!collection_id) { ActionResponse.error(res, "collection_id is required", 400); return; }
    const invitees = await userSharesService.listInvitees(collection_id, req.session.user_id!);
    ActionResponse.success(res, invitees, 200, "Invitees fetched");
  });

  static updateDepth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const collection_id = req.params["collection_id"] as string;
    const { share_type } = req.body;
    if (!collection_id || !share_type) {
      ActionResponse.error(res, "collection_id and share_type are required", 400);
      return;
    }
    await userSharesService.updateDepth(collection_id, req.session.user_id!, share_type as ShareType);
    ActionResponse.success(res, null, 200, "Share depth updated");
  });

  static sharedWithMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await userSharesService.sharedWithMe(req.session.user_id!);
    ActionResponse.success(res, data, 200, "Shared collections fetched");
  });

  static viewSharedCollection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const collection_id = req.params["collection_id"] as string;
    if (!collection_id) { ActionResponse.error(res, "collection_id is required", 400); return; }
    const data = await userSharesService.viewSharedCollection(req.session.user_id!, collection_id);
    ActionResponse.success(res, data, 200, "Shared collection fetched");
  });
}
