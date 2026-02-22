import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      if (password.length < 6) {
        res
          .status(400)
          .json({
            success: false,
            message: "Password must be at least 6 characters",
          });
        return;
      }

      const result = await authService.signup(email, password);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === "Email already registered") {
        res.status(409).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        res.status(401).json({ success: false, message: error.message });
        return;
      }
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      const result = await authService.forgotPassword(email);
      res.json({ success: true, data: result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
