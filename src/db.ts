import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

export const pool = new Pool({
  connectionString,
});

export async function testDb() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("Postgres: connected");
  } finally {
    client.release();
  }
}
