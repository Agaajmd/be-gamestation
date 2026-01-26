"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/cron.routes.ts
const express_1 = require("express");
const completionCron_1 = require("../cron/completionCron");
const router = (0, express_1.Router)();
// Endpoint untuk trigger manual (hanya untuk development/testing)
if (process.env.NODE_ENV !== "production") {
    router.post("/trigger-completion", async (_req, res) => {
        try {
            console.log("🚀 Manually triggering completion cron job...");
            await (0, completionCron_1.processCompletions)();
            res.json({
                success: true,
                message: "Cron job executed successfully"
            });
        }
        catch (error) {
            console.error("❌ Cron job error:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
}
exports.default = router;
//# sourceMappingURL=cronRoutes.js.map