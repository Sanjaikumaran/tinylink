import { Router } from "express";
import { pool } from "../db";
import { authRequired, AuthRequest } from "../middleware/authRequired";
import { CODE_REGEX, generateRandomCode, normalizeUrl } from "../utils";
import validUrl from "valid-url";

const router = Router();
router.use(authRequired);

router.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { target_url: rawTarget, code: maybeCode } = req.body ?? {};
    if (!rawTarget || typeof rawTarget !== "string")
      return res.status(400).json({ error: "target_url required" });
    const target_url = normalizeUrl(rawTarget);
    if (!validUrl.isWebUri(target_url))
      return res.status(400).json({ error: "invalid target_url" });

    let code = maybeCode;
    if (code) {
      if (typeof code !== "string" || !CODE_REGEX.test(code))
        return res
          .status(400)
          .json({ error: "code must match [A-Za-z0-9]{6,8}" });
    } else {
      let attempts = 0;
      do {
        code = generateRandomCode(6);
        const { rowCount } = await pool.query(
          "SELECT 1 FROM links WHERE code=$1",
          [code]
        );
        if (rowCount === 0) break;
        attempts++;
      } while (attempts < 5);
      if (!code)
        return res.status(500).json({ error: "could not generate code" });
    }

    const created = await pool
      .query(
        `INSERT INTO links (code, target_url, user_id, total_clicks, last_clicked, created_at)
       VALUES ($1, $2, $3, 0, NULL, now())
       RETURNING code, target_url, created_at, total_clicks, last_clicked`,
        [code, target_url, userId]
      )
      .catch((err: any) => {
        if (err.code === "23505") return { duplicate: true };
        throw err;
      });

    if ((created as any).duplicate) {
      return res.status(409).json({ error: "code already exists" });
    }

    const row = (created as any).rows[0];
    const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    return res.status(201).json({
      code: row.code,
      target_url: row.target_url,
      shortUrl: `${base}/${row.code}`,
      created_at: row.created_at,
      total_clicks: Number(row.total_clicks),
      last_clicked: row.last_clicked,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    const q = await pool.query(
      "SELECT code, target_url, created_at, total_clicks, last_clicked FROM links WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );
    return res.json(q.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

router.get("/:code", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const code = req.params.code;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    if (!CODE_REGEX.test(code))
      return res.status(400).json({ error: "invalid code" });

    const q = await pool.query(
      "SELECT code, target_url, created_at, total_clicks, last_clicked FROM links WHERE code=$1 AND user_id=$2",
      [code, userId]
    );
    if (q.rowCount === 0) return res.status(404).json({ error: "not found" });
    return res.json(q.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

router.delete("/:code", async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const code = req.params.code;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    if (!CODE_REGEX.test(code))
      return res.status(400).json({ error: "invalid code" });

    const del = await pool.query(
      "DELETE FROM links WHERE code=$1 AND user_id=$2 RETURNING code",
      [code, userId]
    );
    if (del.rowCount === 0) return res.status(404).json({ error: "not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
