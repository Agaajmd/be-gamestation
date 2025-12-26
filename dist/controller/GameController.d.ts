import { Request, Response } from "express";
/**
 * GET /games
 * Get list game (public endpoint)
 */
export declare const getGames: (req: Request, res: Response) => Promise<void>;
/**
 * GET /games/:id
 * Get game by ID
 */
export declare const getGameById: (req: Request, res: Response) => Promise<void>;
/**
 * POST /games
 * Create new game (owner/admin only)
 */
export declare const createGame: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /games/:id
 * Update game (owner/admin only)
 */
export declare const updateGame: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /games/:id
 * Delete game (owner only)
 */
export declare const deleteGame: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=GameController.d.ts.map