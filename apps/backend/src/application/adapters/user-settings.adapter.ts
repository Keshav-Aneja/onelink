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
    const { accent_color, view_mode, grid_density } = req.body;
    const data: Record<string, unknown> = {};
    if (accent_color !== undefined) data.accent_color = accent_color;
    if (view_mode !== undefined) data.view_mode = view_mode;
    if (grid_density !== undefined) data.grid_density = grid_density;
    const service = new UserSettingsService();
    const settings = await service.updateSettings(req.session.user_id!, data);
    ActionResponse.success(res, settings, 200, "Settings updated");
  });
}
