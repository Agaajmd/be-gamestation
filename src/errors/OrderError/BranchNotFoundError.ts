export class BranchNotFoundError extends Error {
  constructor(message: string = "Branch tidak ditemukan") {
    super(message);
    this.name = "BranchNotFoundError";
  }
}
