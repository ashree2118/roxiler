import prisma from "../config/prisma.js";
import {
  buildTextFilter,
  computeAverageRating,
  parseSortOrder,
} from "../utils/rating.utils.js";

function formatStoreForUser(store, userRating) {
  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    averageRating: computeAverageRating(store.ratings),
    ratingsCount: store.ratings.length,
    userRating: userRating?.rating ?? null,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
}

export async function getStores(req, res) {
  try {
    const { name, address, sortBy = "name", sortOrder } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: buildTextFilter(name) }),
        ...(address && { address: buildTextFilter(address) }),
      },
      include: {
        ratings: true,
      },
    });

    const userRatings = await prisma.rating.findMany({
      where: {
        userId: req.user.id,
        storeId: { in: stores.map((store) => store.id) },
      },
    });

    const userRatingsByStoreId = new Map(
      userRatings.map((rating) => [rating.storeId, rating])
    );

    let formattedStores = stores.map((store) =>
      formatStoreForUser(store, userRatingsByStoreId.get(store.id))
    );

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
    console.error("Get stores error:", error);
    return res.status(500).json({ message: "Failed to fetch stores." });
  }
}

export async function rateStore(req, res) {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }

    const savedRating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: req.user.id,
          storeId,
        },
      },
      update: { rating },
      create: {
        rating,
        userId: req.user.id,
        storeId,
      },
    });

    return res.json({
      message: "Rating saved successfully",
      rating: savedRating,
    });
  } catch (error) {
    console.error("Rate store error:", error);
    return res.status(500).json({ message: "Failed to save rating." });
  }
}
