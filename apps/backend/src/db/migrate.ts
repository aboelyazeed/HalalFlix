import fs from "fs";
import path from "path";
import { pool, query } from "../config/database";

async function migrate() {
  try {
    console.log("Running migrations...");
    const migrationFile = path.join(__dirname, "migrations", "001_initial.sql");
    const sql = fs.readFileSync(migrationFile, "utf8");
    await query(sql);
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

migrate();
