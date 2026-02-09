// src/routes/cron.routes.ts
import { Router } from "express";
import { processCompletions } from "../cron/completionCron";
import { apiKeyAuthMiddleware } from "../helper/apiKeyManager";

const router = Router();

router.use(apiKeyAuthMiddleware);

// Endpoint untuk trigger manual (hanya untuk development/testing)
if (process.env.NODE_ENV !== "production") {
  router.post("/trigger-completion", async (_req, res) => {
    try {
      console.log("🚀 Manually triggering completion cron job...");
      await processCompletions();
      res.json({ 
        success: true, 
        message: "Cron job executed successfully" 
      });
    } catch (error: any) {
      console.error("❌ Cron job error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
}

export default router;