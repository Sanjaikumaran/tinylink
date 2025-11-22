import { Router } from "express";
import os from "os";

const router = Router();

router.get("/", async (req, res) => {
  const uptimeSeconds = process.uptime();

  const system = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    total_memory_mb: Math.round(os.totalmem() / 1024 / 1024),
    free_memory_mb: Math.round(os.freemem() / 1024 / 1024),
  };

  const processInfo = {
    uptime_seconds: uptimeSeconds,
    uptime_human: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor(
      (uptimeSeconds % 3600) / 60
    )}m`,
    memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    node_version: process.version,
    pid: process.pid,
  };

  return res.status(200).json({
    ok: true,
    version: "1.0",
    timestamp: new Date().toISOString(),
    system,
    process: processInfo,
  });
});

export default router;
