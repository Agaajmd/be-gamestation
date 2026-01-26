"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdvanceBookingPrice = exports.updateAdvanceBookingPrice = exports.getAdvanceBookingPrices = exports.addAdvanceBookingPrice = void 0;
// Service
const advanceBookingPriceService_1 = require("../service/AdvanceBookingPriceService/advanceBookingPriceService");
// Repository
const advanceBookingPriceRepository_1 = require("../repository/advanceBookingPriceRepository");
// Error
const responseHelper_1 = require("../helper/responseHelper");
/**
 * POST /advance-booking-price
 * Biaya tambahan untuk booking di muka (berapa hari sebelumnya)
 */
const addAdvanceBookingPrice = async (req, res) => {
    try {
        const { branchId, minDays, maxDays, additionalFee } = req.body;
        const newAdvanceBookingPrice = await (0, advanceBookingPriceService_1.addAdvanceBookingPriceService)({
            branchId: BigInt(branchId),
            minDays,
            maxDays,
            additionalFee,
        });
        res.status(200).json({
            success: true,
            data: newAdvanceBookingPrice,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.addAdvanceBookingPrice = addAdvanceBookingPrice;
/** GET /advance-booking-prices
 * Mendapatkan semua advance booking prices
 */
const getAdvanceBookingPrices = async (_req, res) => {
    try {
        const advanceBookingPrices = await advanceBookingPriceRepository_1.AdvanceBookingPriceRepository.findAll();
        res.status(200).json({
            success: true,
            data: advanceBookingPrices,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.getAdvanceBookingPrices = getAdvanceBookingPrices;
/**
 * PUT /advance-booking-price/:id
 * Memperbarui advance booking price berdasarkan ID
 */
const updateAdvanceBookingPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { minDays, maxDays, additionalFee } = req.body;
        const idBigInt = BigInt(id);
        const updatedAdvanceBookingPrice = await (0, advanceBookingPriceService_1.updateAdvanceBookingPriceService)({
            id: idBigInt,
            minDays,
            maxDays,
            additionalFee,
        });
        res.status(200).json({
            success: true,
            data: updatedAdvanceBookingPrice,
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.updateAdvanceBookingPrice = updateAdvanceBookingPrice;
/** DELETE /advance-booking-price/:id
 * Menghapus advance booking price berdasarkan ID
 */
const deleteAdvanceBookingPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const idBigInt = BigInt(id);
        await (0, advanceBookingPriceService_1.deleteAdvanceBookingPriceService)(idBigInt);
        res.status(200).json({
            success: true,
            message: "Advance booking price berhasil dihapus",
        });
    }
    catch (error) {
        (0, responseHelper_1.handleError)(error, res);
    }
};
exports.deleteAdvanceBookingPrice = deleteAdvanceBookingPrice;
//# sourceMappingURL=AdvanceBookingPriceController.js.map