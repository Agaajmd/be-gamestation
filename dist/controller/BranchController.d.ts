import { Request, Response } from "express";
/**
 * POST /branches
 * Owner membuat cabang baru
 * Required: Owner profile must exist
 */
export declare const createBranch: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches
 * Get list cabang (owner melihat cabang miliknya, admin melihat cabang yang dia kelola)
 */
export declare const getBranches: (req: Request, res: Response) => Promise<void>;
/**
 * GET /branches/:id
 * Get detail cabang
 */
export declare const getBranchById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /branches/:id
 * Update cabang (hanya owner)
 */
export declare const updateBranch: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /branches/:id
 * Delete cabang (hanya owner)
 */
export declare const deleteBranch: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=BranchController.d.ts.map