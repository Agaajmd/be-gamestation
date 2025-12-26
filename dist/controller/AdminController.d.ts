import { Request, Response } from "express";
/**
 * POST /branches/:id/admins
 * Owner menambahkan admin/staff ke cabang
 */
export declare const addBranchAdmin: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:id/admins
 * Owner melihat daftar admin di cabang
 */
export declare const getBranchAdmins: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /branches/:id/admins/:adminId
 * Owner mengupdate info admin di cabang
 */
export declare const updateBranchAdmin: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branches/:id/admins/:adminId
 * Owner menghapus admin dari cabang
 */
export declare const removeBranchAdmin: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=AdminController.d.ts.map