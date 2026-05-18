import type { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import UserSettingsService from "../../infrastructure/services/user-settings.service";
import { ActionResponse } from "@onelink/action";

export default class UserSettingsAdapter {
  static getSettings = asyncHandler(async (req: Request, res: Response) => {
    const service = new UserSettingsService();
    const settings = await service.getSettings(req.session.user_id!);
    ActionResponse.success(res, settings, 200, "Settings fetched");
  });

  static updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const { accent_color, view_mode, grid_density, show_og_image, show_collection_tree } = req.body;
    const data: Record<string, unknown> = {};
    if (accent_color !== undefined) data["accent_color"] = accent_color;
    if (view_mode !== undefined) data["view_mode"] = view_mode;
    if (grid_density !== undefined) data["grid_density"] = grid_density;
    if (show_og_image !== undefined) data["show_og_image"] = show_og_image;
    if (show_collection_tree !== undefined) data["show_collection_tree"] = show_collection_tree;
    const service = new UserSettingsService();
    const settings = await service.updateSettings(req.session.user_id!, data);
    ActionResponse.success(res, settings, 200, "Settings updated");
  });
}
