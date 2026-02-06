import { Request, Response } from "express";
import {
  createAnnouncementService,
  getAnnouncementsService,
  getActiveAnnouncementsService,
  getAnnouncementByIdService,
  updateAnnouncementService,
  deleteAnnouncementService,
} from "../service/AnnouncementService/announcementService";

/**
 * Create new announcement
 * POST /api/announcements
 */
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, forBranch, startDate, endDate } = req.body;

    const announcement = await createAnnouncementService({
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
  } catch (error) {
    throw error;
  }
};

/**
 * Get all announcements with pagination
 * GET /api/announcements
 */
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const take = req.query.take ? parseInt(req.query.take as string) : 10;
    const branchId = req.query.branchId as string | undefined;

    const result = await getAnnouncementsService({
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
  } catch (error) {
    throw error;
  }
};

/**
 * Get active announcements only (current date within range)
 * GET /api/announcements/active
 */
export const getActiveAnnouncements = async (req: Request, res: Response) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const take = req.query.take ? parseInt(req.query.take as string) : 10;
    const branchId = req.query.branchId as string | undefined;

    const result = await getActiveAnnouncementsService({
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
  } catch (error) {
    throw error;
  }
};

/**
 * Get announcement by ID
 * GET /api/announcements/:id
 */
export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await getAnnouncementByIdService(id);

    res.status(200).json({
      success: true,
      message: "Announcement berhasil diambil",
      data: announcement,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update announcement
 * PUT /api/announcements/:id
 */
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, forBranch, startDate, endDate } = req.body;

    const updatedAnnouncement = await updateAnnouncementService({
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
  } catch (error) {
    throw error;
  }
};

/**
 * Delete announcement
 * DELETE /api/announcements/:id
 */
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await deleteAnnouncementService(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    throw error;
  }
};
