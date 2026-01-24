export class BookingInPastError extends Error {
  constructor(message: string = "Tanggal atau waktu booking sudah lewat") {
    super(message);
    this.name = "BookingInPastError";
  }
}
