"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const appError_1 = require("../errors/appError");
// utils/responseHandler.ts
const handleError = (error, res) => {
    if (error instanceof appError_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            code: error.code,
            ...(error.details && { details: error.details }),
        });
        return;
    }
    console.error("Unexpected error:", error);
    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
    });
};
exports.handleError = handleError;
//# sourceMappingURL=responseHelper.js.map