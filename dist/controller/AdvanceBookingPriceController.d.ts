import { Request, Response } from "express";
/**
 * POST /advance-booking-price
 * Biaya tambahan untuk booking di muka (berapa hari sebelumnya)
 */
export declare const addAdvanceBookingPrice: (req: Request, res: Response) => Promise<void>;
/** GET /advance-booking-prices
 * Mendapatkan semua advance booking prices
 */
export declare const getAdvanceBookingPrices: (_req: Request, res: Response) => Promise<void>;
/**
 * PUT /advance-booking-price/:id
 * Memperbarui advance booking price berdasarkan ID
 */
export declare const updateAdvanceBookingPrice: (req: Request, res: Response) => Promise<void>;
/** DELETE /advance-booking-price/:id
 * Menghapus advance booking price berdasarkan ID
 */
export declare const deleteAdvanceBookingPrice: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=AdvanceBookingPriceController.d.ts.map