import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import linksRouter from "./routes/publicLinks";
import healthRoute from "./routes/health";
import { pool, testDb } from "./db";
import { CODE_REGEX } from "./utils";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("*") ||
        origin.includes("localhost") ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/healthz", healthRoute);
app.use("/api/links", linksRouter);

app.get("/:code", async (req: Request, res: Response) => {
  try {
    const code = req.params.code;

    if (!CODE_REGEX.test(code)) {
      return res.status(404).send("Code not found");
    }

    const q = await pool.query("SELECT target_url FROM links WHERE code=$1", [
      code,
    ]);

    if (q.rowCount === 0) return res.status(404).send("Data Not found");

    const target = q.rows[0].target_url as string;

    await pool.query(
      "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code=$1",
      [code]
    );

    return res.status(200).json({ target });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

testDb()
  .then(() => console.log("Database connected."))
  .catch((err) => console.error("Database connection failed:", err));

export default app;
