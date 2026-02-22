import { Router } from "express";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();
const controller = new UsersController();

router.use(authMiddleware);

router.get("/me", (req, res) => controller.getMe(req, res));
router.get("/profiles", (req, res) => controller.getProfiles(req, res));
router.post("/profiles", (req, res) => controller.createProfile(req, res));
router.put("/profiles/:id", (req, res) => controller.updateProfile(req, res));
router.delete("/profiles/:id", (req, res) =>
  controller.deleteProfile(req, res),
);

export default router;
