import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import linksRouter from "./routes/publicLinks";
import privateLinksRouter from "./routes/privateLinks";
import authRouter from "./routes/auth";
import { pool, testDb } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

app.use("/api/links", linksRouter);
app.use("/api/private/links", privateLinksRouter);
app.use("/api/auth", authRouter);

app.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(404).send("Not found");
    }
    const q = await pool.query("SELECT target_url FROM links WHERE code=$1", [
      code,
    ]);
    if (q.rowCount === 0) return res.status(404).send("Not found");
    const target = q.rows[0].target_url as string;
    await pool.query(
      "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = now() WHERE code=$1",
      [code]
    );
    return res.redirect(302, target);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

const PORT = Number(process.env.PORT || 5000);

testDb().catch((e) => {
  console.error("DB test failed", e);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`TinyLink server listening on port ${PORT}`);
});
