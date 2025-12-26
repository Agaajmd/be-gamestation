import { Request, Response } from "express";
/**
 * POST /branches/:id/category
 * Owner/admin menambahkan kategori order ke cabang
 */
export declare const addCategory: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:id/category
 * Mendapatkan semua kategori di cabang
 */
export declare const getCategories: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /branches/:branchId/device-categories/:categoryId
 * Owner/admin mengupdate kategori device
 */
export declare const updateCategory: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branches/:branchId/device-categories/:categoryId
 * Owner/admin menghapus kategori device
 */
export declare const deleteDeviceCategory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=CategoryController.d.ts.map