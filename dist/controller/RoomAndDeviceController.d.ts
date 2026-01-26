import { Request, Response } from "express";
/**
 * POST /branches/:id/rooms-and-devices
 * Add room and device to branch (admin/owner only)
 */
export declare const addRoomAndDevice: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/rooms-and-devices
 * Get rooms and devices by branch with filters
 */
export declare const getRoomsAndDevices: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Get room and device details by ID
 */
export declare const getRoomAndDeviceDetails: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Update room and device (admin/owner only)
 */
export declare const updateRoomAndDevice: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Delete room and device (admin/owner only)
 */
export declare const deleteRoomAndDevice: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=RoomAndDeviceController.d.ts.map