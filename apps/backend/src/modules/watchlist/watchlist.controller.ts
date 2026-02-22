import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { WatchlistService } from "./watchlist.service";

const watchlistService = new WatchlistService();

export class WatchlistController {
  async getWatchlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const profileId = req.query.profileId as string;
      if (!profileId) {
        res
          .status(400)
          .json({ success: false, message: "profileId is required" });
        return;
      }
      const items = await watchlistService.getWatchlist(profileId);
      res.json({ success: true, data: items });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async addToWatchlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { profileId, movieId } = req.body;
      if (!profileId || !movieId) {
        res
          .status(400)
          .json({
            success: false,
            message: "profileId and movieId are required",
          });
        return;
      }
      const item = await watchlistService.addToWatchlist(profileId, movieId);
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      if (error.message === "Already in watchlist") {
        res.status(409).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async removeFromWatchlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { profileId, movieId } = req.body;
      if (!profileId || !movieId) {
        res
          .status(400)
          .json({
            success: false,
            message: "profileId and movieId are required",
          });
        return;
      }
      const result = await watchlistService.removeFromWatchlist(
        profileId,
        movieId,
      );
      res.json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === "Item not in watchlist") {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
