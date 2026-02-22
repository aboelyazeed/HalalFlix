import { v4 as uuidv4 } from "uuid";
import { query } from "../../config/database";

export class UsersService {
  async getUser(userId: string) {
    const result = await query(
      "SELECT id, email, subscription_status, subscription_plan, created_at FROM users WHERE id = $1",
      [userId],
    );
    if (result.rows.length === 0) throw new Error("User not found");
    const u = result.rows[0];
    return {
      id: u.id,
      email: u.email,
      subscriptionStatus: u.subscription_status,
      subscriptionPlan: u.subscription_plan,
      createdAt: u.created_at,
    };
  }

  async getProfiles(userId: string) {
    const result = await query(
      "SELECT id, user_id, name, avatar_url, is_kids, created_at FROM profiles WHERE user_id = $1 ORDER BY created_at",
      [userId],
    );
    return result.rows.map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      name: p.name,
      avatarUrl: p.avatar_url,
      isKids: p.is_kids,
      createdAt: p.created_at,
    }));
  }

  async createProfile(
    userId: string,
    name: string,
    avatarUrl: string,
    isKids: boolean,
  ) {
    // Check profile limit
    const existing = await query(
      "SELECT COUNT(*) as count FROM profiles WHERE user_id = $1",
      [userId],
    );
    if (parseInt(existing.rows[0].count) >= 4) {
      throw new Error("Maximum 4 profiles allowed");
    }

    const id = uuidv4();
    await query(
      `INSERT INTO profiles (id, user_id, name, avatar_url, is_kids, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [id, userId, name, avatarUrl, isKids],
    );

    return {
      id,
      userId,
      name,
      avatarUrl,
      isKids,
      createdAt: new Date().toISOString(),
    };
  }

  async updateProfile(
    userId: string,
    profileId: string,
    updates: { name?: string; avatarUrl?: string; isKids?: boolean },
  ) {
    // Verify profile belongs to user
    const check = await query(
      "SELECT id FROM profiles WHERE id = $1 AND user_id = $2",
      [profileId, userId],
    );
    if (check.rows.length === 0) throw new Error("Profile not found");

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(updates.avatarUrl);
    }
    if (updates.isKids !== undefined) {
      fields.push(`is_kids = $${paramIndex++}`);
      values.push(updates.isKids);
    }

    if (fields.length === 0) throw new Error("No fields to update");

    values.push(profileId);
    await query(
      `UPDATE profiles SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values,
    );

    return { message: "Profile updated" };
  }

  async deleteProfile(userId: string, profileId: string) {
    const check = await query(
      "SELECT id FROM profiles WHERE id = $1 AND user_id = $2",
      [profileId, userId],
    );
    if (check.rows.length === 0) throw new Error("Profile not found");

    // Don't allow deleting last profile
    const count = await query(
      "SELECT COUNT(*) as count FROM profiles WHERE user_id = $1",
      [userId],
    );
    if (parseInt(count.rows[0].count) <= 1) {
      throw new Error("Cannot delete the last profile");
    }

    await query("DELETE FROM profiles WHERE id = $1", [profileId]);
    return { message: "Profile deleted" };
  }
}
