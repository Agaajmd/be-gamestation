interface CreateGamePayload {
    name: string;
    deviceType: DeviceType;
}
interface UpdateGamePayload {
    gameId: bigint;
    name?: string;
    deviceType?: DeviceType;
}
import { DeviceType } from "@prisma/client";
export declare function getGamesService(deviceType?: DeviceType): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    deviceType: import("@prisma/client").$Enums.DeviceType | null;
}[]>;
export declare function getGameByIdService(gameId: bigint): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    deviceType: import("@prisma/client").$Enums.DeviceType | null;
}>;
export declare function createGameService(payload: CreateGamePayload): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    deviceType: import("@prisma/client").$Enums.DeviceType | null;
}>;
export declare function updateGameService(payload: UpdateGamePayload): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    deviceType: import("@prisma/client").$Enums.DeviceType | null;
}>;
export declare function deleteGameService(gameId: bigint): Promise<{
    name: string;
    id: bigint;
    createdAt: Date;
    deviceType: import("@prisma/client").$Enums.DeviceType | null;
}>;
export {};
//# sourceMappingURL=gameService.d.ts.map