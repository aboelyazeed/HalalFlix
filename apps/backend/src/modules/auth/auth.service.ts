import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { query } from "../../config/database";
import { env } from "../../config/env";

export class AuthService {
  async signup(email: string, password: string) {
    // Check if user exists
    const existing = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      throw new Error("Email already registered");
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    await query(
      `INSERT INTO users (id, email, password_hash, subscription_status, subscription_plan, created_at)
       VALUES ($1, $2, $3, 'trial', 'monthly', NOW())`,
      [id, email, passwordHash],
    );

    // Create default profile
    const profileId = uuidv4();
    await query(
      `INSERT INTO profiles (id, user_id, name, avatar_url, is_kids, created_at)
       VALUES ($1, $2, $3, $4, false, NOW())`,
      [profileId, id, email.split("@")[0], "/avatars/default.png"],
    );

    const token = this.generateToken(id);

    return {
      token,
      user: {
        id,
        email,
        subscriptionStatus: "trial" as const,
        subscriptionPlan: "monthly" as const,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async login(email: string, password: string) {
    const result = await query(
      "SELECT id, email, password_hash, subscription_status, subscription_plan, created_at FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        subscriptionStatus: user.subscription_status,
        subscriptionPlan: user.subscription_plan,
        createdAt: user.created_at,
      },
    };
  }

  async forgotPassword(email: string) {
    const result = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    // Always return success to prevent email enumeration
    if (result.rows.length > 0) {
      // TODO: Send actual reset email
      console.log(`Password reset requested for ${email}`);
    }
    return { message: "If the email exists, a reset link has been sent." };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  }
}
