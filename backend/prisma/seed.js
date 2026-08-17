import bcrypt from "bcryptjs";
import prisma, { disconnect } from "../src/config/prisma.js";

const DEFAULT_PASSWORD = "Password123!";

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      address: "100 Admin Plaza, Admin City, AC 10001",
      role: "ADMIN",
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: "owner1@test.com" },
    update: {},
    create: {
      name: "Alice Store Owner",
      email: "owner1@test.com",
      password: hashedPassword,
      address: "200 Commerce Street, Retail Town, RT 20002",
      role: "STORE_OWNER",
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner2@test.com" },
    update: {},
    create: {
      name: "Bob Store Owner",
      email: "owner2@test.com",
      password: hashedPassword,
      address: "300 Market Avenue, Shop City, SC 30003",
      role: "STORE_OWNER",
    },
  });

  const store1 = await prisma.store.upsert({
    where: { email: "freshmart@test.com" },
    update: { ownerId: owner1.id },
    create: {
      name: "Fresh Mart",
      email: "freshmart@test.com",
      address: "10 Grocery Lane, Retail Town, RT 20002",
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: "techhub@test.com" },
    update: { ownerId: owner2.id },
    create: {
      name: "Tech Hub",
      email: "techhub@test.com",
      address: "20 Gadget Boulevard, Shop City, SC 30003",
      ownerId: owner2.id,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user1@test.com" },
    update: {},
    create: {
      name: "Charlie User",
      email: "user1@test.com",
      password: hashedPassword,
      address: "400 Residential Road, User City, UC 40004",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@test.com" },
    update: {},
    create: {
      name: "Diana User",
      email: "user2@test.com",
      password: hashedPassword,
      address: "500 Suburban Street, User City, UC 40005",
      role: "USER",
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: { userId: user1.id, storeId: store1.id },
    },
    update: { rating: 5 },
    create: {
      rating: 5,
      userId: user1.id,
      storeId: store1.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: { userId: user2.id, storeId: store1.id },
    },
    update: { rating: 4 },
    create: {
      rating: 4,
      userId: user2.id,
      storeId: store1.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: { userId: user1.id, storeId: store2.id },
    },
    update: { rating: 3 },
    create: {
      rating: 3,
      userId: user1.id,
      storeId: store2.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: { userId: user2.id, storeId: store2.id },
    },
    update: { rating: 5 },
    create: {
      rating: 5,
      userId: user2.id,
      storeId: store2.id,
    },
  });

  console.log("Seed completed successfully");
  console.log({
    admin: admin.email,
    storeOwners: [owner1.email, owner2.email],
    stores: [store1.email, store2.email],
    users: [user1.email, user2.email],
    defaultPassword: DEFAULT_PASSWORD,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await disconnect();
  });
