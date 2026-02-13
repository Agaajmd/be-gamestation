import { Request, Response } from "express";
/**
 * Create new announcement
 * POST /api/announcements
 */
export declare const createAnnouncement: (req: Request, res: Response) => Promise<void>;
/**
 * Get all announcements with pagination
 * GET /api/announcements
 */
export declare const getAnnouncements: (req: Request, res: Response) => Promise<void>;
/**
 * Get active announcements only (current date within range)
 * GET /api/announcements/active
 */
export declare const getActiveAnnouncements: (req: Request, res: Response) => Promise<void>;
/**
 * Get announcement by ID
 * GET /api/announcements/:id
 */
export declare const getAnnouncementById: (req: Request, res: Response) => Promise<void>;
/**
 * Update announcement
 * PUT /api/announcements/:id
 */
export declare const updateAnnouncement: (req: Request, res: Response) => Promise<void>;
/**
 * Delete announcement
 * DELETE /api/announcements/:id
 */
export declare const deleteAnnouncement: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=AnnouncementController.d.ts.map