import { AppError } from "../appError";

export class RoomAndDeviceNotFoundError extends AppError {
  constructor() {
    super("Ruangan dan perangkat tidak ditemukan", 404, "ROOM_AND_DEVICE_NOT_FOUND");
  }
}

export class RoomAndDeviceUnavailableError extends AppError {
    constructor() {
        super("Ruangan dan perangkat tidak tersedia", 400, "ROOM_AND_DEVICE_UNAVAILABLE");
    }
 }