"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncompatibleDeviceTypeError = exports.InvalidGameDataError = exports.GameAlreadyExistsError = exports.GameNotFoundError = void 0;
const appError_1 = require("../appError");
class GameNotFoundError extends appError_1.AppError {
    constructor() {
        super("Game tidak ditemukan", 404, "GAME_NOT_FOUND");
    }
}
exports.GameNotFoundError = GameNotFoundError;
class GameAlreadyExistsError extends appError_1.AppError {
    constructor() {
        super("Game dengan nama dan deviceType yang sama sudah ada", 400, "GAME_ALREADY_EXISTS");
    }
}
exports.GameAlreadyExistsError = GameAlreadyExistsError;
class InvalidGameDataError extends appError_1.AppError {
    missingGameIds;
    constructor(missingGameIds) {
        super("Beberapa game tidak ditemukan", 400, "INVALID_GAME_DATA", {
            missingGameIds,
        });
        this.missingGameIds = missingGameIds;
    }
}
exports.InvalidGameDataError = InvalidGameDataError;
class IncompatibleDeviceTypeError extends appError_1.AppError {
    constructor(deviceType, incompatibleGames) {
        super(`DeviceType tidak kompatibel dengan device type ${deviceType}`, 400, "INCOMPATIBLE_DEVICE_TYPE", {
            deviceType,
            incompatibleGames: incompatibleGames.map((g) => ({
                id: g.id.toString(),
                name: g.name,
                deviceType: g.deviceType,
            })),
        });
    }
}
exports.IncompatibleDeviceTypeError = IncompatibleDeviceTypeError;
//# sourceMappingURL=gameError.js.map