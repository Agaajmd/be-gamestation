"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncementService = exports.updateAnnouncementService = exports.getAnnouncementByIdService = exports.getActiveAnnouncementsService = exports.getAnnouncementsService = exports.createAnnouncementService = void 0;
// Repositories
const announcementRepository_1 = require("../../repository/announcementRepository");
const inputSanitizer_1 = require("../../helper/inputSanitizer");
// Errors
const announcementError_1 = require("../../errors/AnnouncementError/announcementError");
/**
 * Create announcement
 */
const createAnnouncementService = async (payload) => {
    const { title: rawTitle, content: rawContent, forBranch, startDate, endDate, } = payload;
    // Sanitize inputs
    const title = (0, inputSanitizer_1.sanitizeString)(rawTitle);
    const content = (0, inputSanitizer_1.sanitizeString)(rawContent);
    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
        throw new announcementError_1.InvalidAnnouncementDateError();
    }
    // Create announcement
    const announcement = await announcementRepository_1.AnnouncementRepository.create({
        title,
        content,
        forBranch: forBranch,
        startDate: startDateObj,
        endDate: endDateObj,
    });
    return formatAnnouncementResponse(announcement);
};
exports.createAnnouncementService = createAnnouncementService;
/**
 * Get all announcements with pagination
 */
const getAnnouncementsService = async (payload) => {
    const { skip = 0, take = 10, branchId } = payload;
    const where = {};
    if (branchId) {
        where.OR = [{ forBranch: BigInt(branchId) }, { forBranch: null }];
    }
    const announcements = await announcementRepository_1.AnnouncementRepository.findMany(where, skip, take);
    const total = await announcementRepository_1.AnnouncementRepository.count(where);
    return {
        announcements: announcements.map(formatAnnouncementResponse),
        total,
        skip,
        take,
    };
};
exports.getAnnouncementsService = getAnnouncementsService;
/**
 * Get active announcements only
 */
const getActiveAnnouncementsService = async (payload) => {
    const { skip = 0, take = 10, branchId } = payload;
    const announcements = await announcementRepository_1.AnnouncementRepository.findActive(branchId ? BigInt(branchId) : undefined, skip, take);
    return {
        announcements: announcements.map(formatAnnouncementResponse),
        total: announcements.length,
        skip,
        take,
    };
};
exports.getActiveAnnouncementsService = getActiveAnnouncementsService;
/**
 * Get announcement by ID
 */
const getAnnouncementByIdService = async (id) => {
    const announcement = await announcementRepository_1.AnnouncementRepository.findById(BigInt(id));
    if (!announcement) {
        throw new announcementError_1.AnnouncementNotFoundError();
    }
    return formatAnnouncementResponse(announcement);
};
exports.getAnnouncementByIdService = getAnnouncementByIdService;
/**
 * Update announcement
 */
const updateAnnouncementService = async (payload) => {
    const { id, title: rawTitle, content: rawContent, forBranch, startDate, endDate, } = payload;
    // Sanitize inputs
    const title = rawTitle ? (0, inputSanitizer_1.sanitizeString)(rawTitle) : undefined;
    const content = rawContent ? (0, inputSanitizer_1.sanitizeString)(rawContent) : undefined;
    // Check if announcement exists
    const announcement = await announcementRepository_1.AnnouncementRepository.findById(BigInt(id));
    if (!announcement) {
        throw new announcementError_1.AnnouncementNotFoundError();
    }
    // Prepare update data
    const updateData = {};
    if (title)
        updateData.title = title;
    if (content)
        updateData.content = content;
    if (forBranch !== undefined) {
        updateData.forBranch = forBranch ? BigInt(forBranch) : null;
    }
    if (startDate)
        updateData.startDate = new Date(startDate);
    if (endDate)
        updateData.endDate = new Date(endDate);
    // Validate dates if both are being updated
    if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (endDateObj <= startDateObj) {
            throw new announcementError_1.InvalidAnnouncementDateError();
        }
    }
    else if (startDate && !endDate) {
        // If only startDate is updated, validate against existing endDate
        const startDateObj = new Date(startDate);
        if (announcement.endDate <= startDateObj) {
            throw new announcementError_1.InvalidAnnouncementDateError();
        }
    }
    else if (!startDate && endDate) {
        // If only endDate is updated, validate against existing startDate
        const endDateObj = new Date(endDate);
        if (endDateObj <= announcement.startDate) {
            throw new announcementError_1.InvalidAnnouncementDateError();
        }
    }
    const updatedAnnouncement = await announcementRepository_1.AnnouncementRepository.update(BigInt(id), updateData);
    return formatAnnouncementResponse(updatedAnnouncement);
};
exports.updateAnnouncementService = updateAnnouncementService;
/**
 * Delete announcement
 */
const deleteAnnouncementService = async (id) => {
    // Check if announcement exists
    const announcement = await announcementRepository_1.AnnouncementRepository.findById(BigInt(id));
    if (!announcement) {
        throw new announcementError_1.AnnouncementNotFoundError();
    }
    await announcementRepository_1.AnnouncementRepository.delete(BigInt(id));
    return {
        message: "Announcement berhasil dihapus",
        id: announcement.id,
    };
};
exports.deleteAnnouncementService = deleteAnnouncementService;
/**
 * Helper function to format announcement response
 */
const formatAnnouncementResponse = (announcement) => {
    return {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        forBranch: announcement.forBranch,
        startDate: announcement.startDate,
        endDate: announcement.endDate,
        createdAt: announcement.createdAt,
        updatedAt: announcement.updatedAt,
    };
};
//# sourceMappingURL=announcementService.js.map