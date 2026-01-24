export class InvalidDeviceStatusError extends Error {
  constructor(message: string = "Status device tidak valid") {
    super(message);
    this.name = "InvalidDeviceStatusError";
  }
}
