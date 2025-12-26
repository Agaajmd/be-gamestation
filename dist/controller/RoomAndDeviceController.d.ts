import { Request, Response } from "express";
/**
 * POST /branches/:id/rooms-and-devices
 * Owner/staff menambahkan room dan device ke cabang
 */
export declare const addRoomAndDevice: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/rooms-and-devices
 * Mendapatkan semua room dan device di cabang
 */
export declare const getRoomsAndDevices: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Mendapatkan detail room dan device di cabang
 */
export declare const getRoomAndDeviceDetails: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /branches/:branchId/rooms-and-devices/:roomAndDeviceId
 * Owner/staff mengupdate room dan device di cabang
 */
export declare const updateRoomAndDevice: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branches/:branchId/devices/:deviceId
 * Owner/staff menghapus device dari cabang
 */
export declare const deleteRoomAndDevice: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=RoomAndDeviceController.d.ts.map