import { Request, Response } from "express";
/**
 * GET /booking/branches
 * Mendapatkan semua cabang untuk halaman booking
 */
export declare const getBranches: (_req: Request, res: Response) => Promise<void>;
/**
 * GET /booking/branches/:branchId/available-dates
 * Mendapatkan tanggal yang tersedia untuk booking
 */
export declare const getAvailableDates: (req: Request, res: Response) => Promise<void>;
/**
 * GET /booking/branches/:branchId/available-times
 * Mendapatkan jam yang tersedia untuk booking di tanggal tertentu
 */
export declare const getAvailableTimes: (req: Request, res: Response) => Promise<void>;
/**
 * GET /booking/branches/:branchId/categories
 * Mendapatkan kategori berdasarkan device type dan version
 */
export declare const getAvailableCategories: (req: Request, res: Response) => Promise<void>;
/**
 * GET /booking/branches/:branchId/rooms-and-devices
 * Mendapatkan room dan device yang tersedia berdasarkan filter
 */
export declare const getAvailableRoomsAndDevices: (req: Request, res: Response) => Promise<void>;
/**
 * POST /booking/calculate-price
 * Menghitung harga booking sebelum checkout
 */
export declare const calculateBookingPrice: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=BookingFlowController.d.ts.map