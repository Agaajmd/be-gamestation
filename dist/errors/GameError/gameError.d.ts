import { AppError } from "../appError";
import { DeviceType } from "@prisma/client";
export declare class GameNotFoundError extends AppError {
    constructor();
}
export declare class GameAlreadyExistsError extends AppError {
    constructor();
}
export declare class InvalidGameDataError extends AppError {
    missingGameIds: bigint[];
    constructor(missingGameIds: bigint[]);
}
export declare class IncompatibleDeviceTypeError extends AppError {
    constructor(deviceType: DeviceType, incompatibleGames: Array<{
        id: bigint;
        name: string;
        deviceType: DeviceType | null;
    }>);
}
//# sourceMappingURL=gameError.d.ts.map