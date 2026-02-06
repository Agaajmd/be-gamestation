// Repositories
import { AnnouncementRepository } from "../../repository/announcementRepository";

// Errors
import {
  AnnouncementNotFoundError,
  InvalidAnnouncementDateError,
} from "../../errors/AnnouncementError/announcementError";

/**
 * Create announcement
 */
export const createAnnouncementService = async (payload: {
  title: string;
  content: string;
  forBranch?: string | number | null;
  startDate: string;
  endDate: string;
}) => {
  const { title, content, forBranch, startDate, endDate } = payload;

  // Validate dates
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (endDateObj <= startDateObj) {
    throw new InvalidAnnouncementDateError();
  }

  // Create announcement
  const announcement = await AnnouncementRepository.create({
    title,
    content,
    forBranch: forBranch ? BigInt(forBranch) : null,
    startDate: startDateObj,
    endDate: endDateObj,
  });

  return formatAnnouncementResponse(announcement);
};

/**
 * Get all announcements with pagination
 */
export const getAnnouncementsService = async (payload: {
  skip?: number;
  take?: number;
  branchId?: string | number | null;
}) => {
  const { skip = 0, take = 10, branchId } = payload;

  const where: any = {};
  if (branchId) {
    where.OR = [{ forBranch: BigInt(branchId) }, { forBranch: null }];
  }

  const announcements = await AnnouncementRepository.findMany(
    where,
    skip,
    take,
  );
  const total = await AnnouncementRepository.count(where);

  return {
    announcements: announcements.map(formatAnnouncementResponse),
    total,
    skip,
    take,
  };
};

/**
 * Get active announcements only
 */
export const getActiveAnnouncementsService = async (payload: {
  skip?: number;
  take?: number;
  branchId?: string | number | null;
}) => {
  const { skip = 0, take = 10, branchId } = payload;

  const announcements = await AnnouncementRepository.findActive(
    branchId ? BigInt(branchId) : undefined,
    skip,
    take,
  );

  return {
    announcements: announcements.map(formatAnnouncementResponse),
    total: announcements.length,
    skip,
    take,
  };
};

/**
 * Get announcement by ID
 */
export const getAnnouncementByIdService = async (id: string | number) => {
  const announcement = await AnnouncementRepository.findById(BigInt(id));

  if (!announcement) {
    throw new AnnouncementNotFoundError();
  }

  return formatAnnouncementResponse(announcement);
};

/**
 * Update announcement
 */
export const updateAnnouncementService = async (payload: {
  id: string | number;
  title?: string;
  content?: string;
  forBranch?: string | number | null;
  startDate?: string;
  endDate?: string;
}) => {
  const { id, title, content, forBranch, startDate, endDate } = payload;

  // Check if announcement exists
  const announcement = await AnnouncementRepository.findById(BigInt(id));
  if (!announcement) {
    throw new AnnouncementNotFoundError();
  }

  // Prepare update data
  const updateData: any = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (forBranch !== undefined) {
    updateData.forBranch = forBranch ? BigInt(forBranch) : null;
  }
  if (startDate) updateData.startDate = new Date(startDate);
  if (endDate) updateData.endDate = new Date(endDate);

  // Validate dates if both are being updated
  if (startDate && endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
      throw new InvalidAnnouncementDateError();
    }
  } else if (startDate && !endDate) {
    // If only startDate is updated, validate against existing endDate
    const startDateObj = new Date(startDate);
    if (announcement.endDate <= startDateObj) {
      throw new InvalidAnnouncementDateError();
    }
  } else if (!startDate && endDate) {
    // If only endDate is updated, validate against existing startDate
    const endDateObj = new Date(endDate);
    if (endDateObj <= announcement.startDate) {
      throw new InvalidAnnouncementDateError();
    }
  }

  const updatedAnnouncement = await AnnouncementRepository.update(
    BigInt(id),
    updateData,
  );

  return formatAnnouncementResponse(updatedAnnouncement);
};

/**
 * Delete announcement
 */
export const deleteAnnouncementService = async (id: string | number) => {
  // Check if announcement exists
  const announcement = await AnnouncementRepository.findById(BigInt(id));
  if (!announcement) {
    throw new AnnouncementNotFoundError();
  }

  await AnnouncementRepository.delete(BigInt(id));

  return {
    message: "Announcement berhasil dihapus",
    id: announcement.id,
  };
};

/**
 * Helper function to format announcement response
 */
const formatAnnouncementResponse = (announcement: any) => {
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
