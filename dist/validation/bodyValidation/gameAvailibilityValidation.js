"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGamesFromDeviceSchema = exports.addGamesToDeviceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addGamesToDeviceSchema = joi_1.default.object({
    gameIds: joi_1.default.alternatives()
        .try(joi_1.default.string().pattern(/^\d+$/).messages({
        "string.pattern.base": "gameId harus berupa string angka",
    }), joi_1.default.array()
        .items(joi_1.default.string().pattern(/^\d+$/).messages({
        "string.pattern.base": "Setiap gameId harus berupa string angka",
    }))
        .min(1)
        .messages({
        "array.min": "gameIds tidak boleh kosong",
    }))
        .required()
        .messages({
        "any.required": "gameIds wajib diisi",
        "alternatives.match": "gameIds harus berupa string untuk 1 game atau array untuk multiple games",
    }),
});
exports.removeGamesFromDeviceSchema = joi_1.default.object({
    gameIds: joi_1.default.alternatives()
        .try(joi_1.default.string().pattern(/^\d+$/).messages({
        "string.pattern.base": "gameId harus berupa string angka",
    }), joi_1.default.array()
        .items(joi_1.default.string().pattern(/^\d+$/).messages({
        "string.pattern.base": "Setiap gameId harus berupa string angka",
    }))
        .min(1)
        .messages({
        "array.min": "gameIds tidak boleh kosong",
    }))
        .required()
        .messages({
        "any.required": "gameIds wajib diisi",
        "alternatives.match": "gameIds harus berupa string untuk 1 game atau array untuk multiple games",
    }),
});
//# sourceMappingURL=gameAvailibilityValidation.js.map