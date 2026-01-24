import { AppError } from "../appError";

export class RoomAndDeviceNotFoundError extends AppError {
  constructor() {
    super(
      "Ruangan dan perangkat tidak ditemukan",
      404,
      "ROOM_AND_DEVICE_NOT_FOUND",
    );
  }
}

export class RoomAndDeviceUnavailableError extends AppError {
  constructor() {
    super(
      "Ruangan dan perangkat tidak tersedia",
      400,
      "ROOM_AND_DEVICE_UNAVAILABLE",
    );
  }
}

export class DuplicateRoomAndDeviceError extends AppError {
  constructor() {
    super("Duplikasi ruangan dan perangkat", 400, "DUPLICATE_ROOM_AND_DEVICE");
  }
}

export class DeviceHasActiveSessionError extends AppError {
  constructor() {
    super(
      "Perangkat memiliki riwayat session dan tidak dapat dihapus",
      400,
      "DEVICE_HAS_ACTIVE_SESSION",
    );
  }
}

export class DeviceHasOrderItemsError extends AppError {
  constructor() {
    super(
      "Perangkat memiliki riwayat order dan tidak dapat dihapus",
      400,
      "DEVICE_HAS_ORDER_ITEMS",
    );
  }
}
