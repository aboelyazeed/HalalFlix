import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/signup", (req, res) => controller.signup(req, res));
router.post("/login", (req, res) => controller.login(req, res));
router.post("/forgot-password", (req, res) =>
  controller.forgotPassword(req, res),
);

export default router;
