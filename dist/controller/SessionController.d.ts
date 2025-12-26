import { Request, Response } from "express";
/**
 * POST /sessions
 * Start a new session (admin only)
 */
export declare const createSession: (req: Request, res: Response) => Promise<void>;
/**
 * GET /sessions
 * Get sessions list (admin/owner only)
 */
export declare const getSessions: (req: Request, res: Response) => Promise<void>;
/**
 * GET /sessions/:id
 * Get session by ID
 */
export declare const getSessionById: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /sessions/:id
 * Update session (stop session) (admin/owner only)
 */
export declare const updateSession: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=SessionController.d.ts.map