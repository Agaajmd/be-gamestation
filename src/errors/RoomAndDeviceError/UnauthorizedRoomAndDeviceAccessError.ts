export class UnauthorizedRoomAndDeviceAccessError extends Error {
  constructor(
    message: string = "Akses ke room dan device ini tidak diizinkan",
  ) {
    super(message);
    this.name = "UnauthorizedRoomAndDeviceAccessError";
  }
}
