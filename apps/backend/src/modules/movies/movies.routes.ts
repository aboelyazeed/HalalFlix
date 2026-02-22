import { Router } from "express";
import { MoviesController } from "./movies.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();
const controller = new MoviesController();

router.use(authMiddleware);

router.get("/home", (req, res) => controller.getHomeFeed(req, res));
router.get("/search", (req, res) => controller.search(req, res));
router.get("/categories", (req, res) => controller.getCategories(req, res));
router.get("/genre/:slug", (req, res) => controller.getByGenre(req, res));
router.get("/:id", (req, res) => controller.getMovieById(req, res));

export default router;
