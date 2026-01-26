import { Request, Response } from "express";
/**
 * POST /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menambahkan 1 atau lebih game ke device
 */
export declare const addGamesToDevice: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branches/:branchId/rooms-and-devices/:roomAndDeviceId/games
 * Menghapus 1 atau lebih game dari device
 */
export declare const removeGamesFromDevice: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=GameAvailabilityController.d.ts.map