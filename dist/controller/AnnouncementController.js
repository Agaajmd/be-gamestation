"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getActiveAnnouncements = exports.getAnnouncements = exports.createAnnouncement = void 0;
const announcementService_1 = require("../service/AnnouncementService/announcementService");
/**
 * Create new announcement
 * POST /api/announcements
 */
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, forBranch, startDate, endDate } = req.body;
        const announcement = await (0, announcementService_1.createAnnouncementService)({
            title,
            content,
            forBranch: forBranch ? BigInt(forBranch) : null,
            startDate,
            endDate,
        });
        res.status(201).json({
            success: true,
            message: "Announcement berhasil dibuat",
            data: announcement,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.createAnnouncement = createAnnouncement;
/**
 * Get all announcements with pagination
 * GET /api/announcements
 */
const getAnnouncements = async (req, res) => {
    try {
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const take = req.query.take ? parseInt(req.query.take) : 10;
        const branchId = req.query.branchId;
        const result = await (0, announcementService_1.getAnnouncementsService)({
            skip,
            take,
            branchId,
        });
        res.status(200).json({
            success: true,
            message: "Daftar announcement berhasil diambil",
            data: result.announcements,
            pagination: {
                skip: result.skip,
                take: result.take,
                total: result.total,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getAnnouncements = getAnnouncements;
/**
 * Get active announcements only (current date within range)
 * GET /api/announcements/active
 */
const getActiveAnnouncements = async (req, res) => {
    try {
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const take = req.query.take ? parseInt(req.query.take) : 10;
        const branchId = req.query.branchId;
        const result = await (0, announcementService_1.getActiveAnnouncementsService)({
            skip,
            take,
            branchId,
        });
        res.status(200).json({
            success: true,
            message: "Daftar announcement aktif berhasil diambil",
            data: result.announcements,
            pagination: {
                skip: result.skip,
                take: result.take,
                total: result.total,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getActiveAnnouncements = getActiveAnnouncements;
/**
 * Get announcement by ID
 * GET /api/announcements/:id
 */
const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await (0, announcementService_1.getAnnouncementByIdService)(id);
        res.status(200).json({
            success: true,
            message: "Announcement berhasil diambil",
            data: announcement,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getAnnouncementById = getAnnouncementById;
/**
 * Update announcement
 * PUT /api/announcements/:id
 */
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, forBranch, startDate, endDate } = req.body;
        const updatedAnnouncement = await (0, announcementService_1.updateAnnouncementService)({
            id,
            title,
            content,
            forBranch,
            startDate,
            endDate,
        });
        res.status(200).json({
            success: true,
            message: "Announcement berhasil diperbarui",
            data: updatedAnnouncement,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateAnnouncement = updateAnnouncement;
/**
 * Delete announcement
 * DELETE /api/announcements/:id
 */
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await (0, announcementService_1.deleteAnnouncementService)(id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
//# sourceMappingURL=AnnouncementController.js.map