import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await usersService.getUser(req.userId!);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async getProfiles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const profiles = await usersService.getProfiles(req.userId!);
      res.json({ success: true, data: profiles });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async createProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, avatarUrl, isKids } = req.body;
      if (!name) {
        res
          .status(400)
          .json({ success: false, message: "Profile name is required" });
        return;
      }
      const profile = await usersService.createProfile(
        req.userId!,
        name,
        avatarUrl || "/avatars/default.png",
        isKids || false,
      );
      res.status(201).json({ success: true, data: profile });
    } catch (error: any) {
      if (error.message === "Maximum 4 profiles allowed") {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await usersService.updateProfile(
        req.userId!,
        id,
        req.body,
      );
      res.json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === "Profile not found") {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async deleteProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await usersService.deleteProfile(req.userId!, id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      if (
        error.message === "Profile not found" ||
        error.message === "Cannot delete the last profile"
      ) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
