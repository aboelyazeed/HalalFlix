import { Router } from "express";
import { WatchlistController } from "./watchlist.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();
const controller = new WatchlistController();

router.use(authMiddleware);

router.get("/", (req, res) => controller.getWatchlist(req, res));
router.post("/", (req, res) => controller.addToWatchlist(req, res));
router.delete("/", (req, res) => controller.removeFromWatchlist(req, res));

export default router;
