import { prisma } from "../src/database";
import bcrypt from "bcrypt";

async function createOwner(data: {
  email: string;
  password: string;
  fullname: string;
  phone?: string;
  companyName: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    // Buat user dengan role owner
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullname: data.fullname,
        phone: data.phone,
        role: "owner",
      },
    });

    // Buat owner record
    const owner = await tx.owner.create({
      data: {
        userId: user.id,
        companyName: data.companyName,
      },
    });

    return { user, owner };
  });

  console.log("✅ Owner created:", {
    email: data.email,
    company: data.companyName,
    userId: result.user.id.toString(),
    ownerId: result.owner.id.toString(),
  });

  return result;
}

async function main() {
  console.log("🌱 Start seeding...");

  try {
    // Cek apakah owner sudah ada
    const existingOwner = await prisma.user.findUnique({
      where: { email: "owner@psstation.com" },
    });

    if (existingOwner) {
      console.log("⚠️  Owner sudah ada, skip seeding");
      return;
    }

    // Buat owner pertama
    await createOwner({
      email: "owner@test.com",
      password: "owner123",
      fullname: "John Doe",
      phone: "08123456789",
      companyName: "Game Station Corp",
    });

    console.log("✅ Seeding finished successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
