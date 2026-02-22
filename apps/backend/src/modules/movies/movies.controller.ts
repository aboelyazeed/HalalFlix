import { Request, Response } from "express";
import { MoviesService } from "./movies.service";

const moviesService = new MoviesService();

export class MoviesController {
  async getHomeFeed(_req: Request, res: Response): Promise<void> {
    try {
      const feed = await moviesService.getHomeFeed();
      res.json({ success: true, data: feed });
    } catch (error) {
      console.error("[getHomeFeed] Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getMovieById(req: Request, res: Response): Promise<void> {
    try {
      const movie = await moviesService.getMovieById(req.params.id);
      res.json({ success: true, data: movie });
    } catch (error: any) {
      if (error.message === "Movie not found") {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q as string;
      if (!q) {
        res
          .status(400)
          .json({ success: false, message: "Search query is required" });
        return;
      }
      const results = await moviesService.search(q);
      res.json({ success: true, data: results });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await moviesService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getByGenre(req: Request, res: Response): Promise<void> {
    try {
      const movies = await moviesService.getByGenre(req.params.slug);
      res.json({ success: true, data: movies });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
