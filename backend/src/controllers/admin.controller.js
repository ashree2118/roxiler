import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import {
  buildTextFilter,
  computeAverageRating,
  parseSortOrder,
} from "../utils/rating.utils.js";

function formatUser(user) {
  const storeAverageRating = user.ownedStore
    ? computeAverageRating(user.ownedStore.ratings)
    : null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ...(user.role === "STORE_OWNER" && {
      storeRating: storeAverageRating,
      ownedStore: user.ownedStore
        ? {
            id: user.ownedStore.id,
            name: user.ownedStore.name,
            email: user.ownedStore.email,
            address: user.ownedStore.address,
            averageRating: storeAverageRating,
          }
        : null,
    }),
  };
}

function formatStore(store) {
  const averageRating = computeAverageRating(store.ratings);

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    ownerId: store.ownerId,
    owner: store.owner
      ? {
          id: store.owner.id,
          name: store.owner.name,
          email: store.owner.email,
        }
      : null,
    averageRating,
    ratingsCount: store.ratings.length,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
}

export async function getDashboard(req, res) {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return res.json({ usersCount, storesCount, ratingsCount });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard data." });
  }
}

export async function getUsers(req, res) {
  try {
    const { name, email, address, role, sortBy = "createdAt", sortOrder } =
      req.query;

    const users = await prisma.user.findMany({
      where: {
        ...(name && { name: buildTextFilter(name) }),
        ...(email && { email: buildTextFilter(email) }),
        ...(address && { address: buildTextFilter(address) }),
        ...(role && { role }),
      },
      include: {
        ownedStore: {
          include: {
            ratings: true,
          },
        },
      },
      orderBy: {
        [sortBy]: parseSortOrder(sortOrder),
      },
    });

    return res.json({ users: users.map(formatUser) });
  } catch (error) {
    console.error("Admin get users error:", error);
    return res.status(500).json({ message: "Failed to fetch users." });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      include: {
        ownedStore: {
          include: {
            ratings: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Admin create user error:", error);
    return res.status(500).json({ message: "Failed to create user." });
  }
}

export async function getStores(req, res) {
  try {
    const { name, email, address, sortBy = "createdAt", sortOrder } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: buildTextFilter(name) }),
        ...(email && { email: buildTextFilter(email) }),
        ...(address && { address: buildTextFilter(address) }),
      },
      include: {
        owner: true,
        ratings: true,
      },
    });

    let formattedStores = stores.map(formatStore);

    if (sortBy === "averageRating") {
      const direction = parseSortOrder(sortOrder) === "desc" ? -1 : 1;
      formattedStores.sort((a, b) => {
        const left = a.averageRating ?? -1;
        const right = b.averageRating ?? -1;
        return (left - right) * direction;
      });
    } else {
      const direction = parseSortOrder(sortOrder) === "desc" ? -1 : 1;
      formattedStores.sort((a, b) => {
        const left = a[sortBy] ?? "";
        const right = b[sortBy] ?? "";

        if (left instanceof Date && right instanceof Date) {
          return (left - right) * direction;
        }

        return String(left).localeCompare(String(right)) * direction;
      });
    }

    return res.json({ stores: formattedStores });
  } catch (error) {
    console.error("Admin get stores error:", error);
    return res.status(500).json({ message: "Failed to fetch stores." });
  }
}

export async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return res.status(409).json({ message: "Store email is already registered." });
    }

    if (ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
        include: { ownedStore: true },
      });

      if (!owner) {
        return res.status(404).json({ message: "Owner not found." });
      }

      if (owner.role !== "STORE_OWNER") {
        return res.status(400).json({
          message: "Assigned owner must have the STORE_OWNER role.",
        });
      }

      if (owner.ownedStore) {
        return res.status(409).json({
          message: "This owner is already assigned to another store.",
        });
      }
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ...(ownerId && { ownerId }),
      },
      include: {
        owner: true,
        ratings: true,
      },
    });

    return res.status(201).json({
      message: "Store created successfully",
      store: formatStore(store),
    });
  } catch (error) {
    console.error("Admin create store error:", error);
    return res.status(500).json({ message: "Failed to create store." });
  }
}
