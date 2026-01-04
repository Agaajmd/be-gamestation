import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hashed: string) {
  if (!plain || !hashed) {
    return false;
  }

  try {
    return await bcrypt.compare(plain, hashed);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}
