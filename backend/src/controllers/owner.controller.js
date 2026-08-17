import prisma from "../config/prisma.js";
import { computeAverageRating } from "../utils/rating.utils.js";

export async function getDashboard(req, res) {
  try {
    const store = await prisma.store.findFirst({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner." });
    }

    const averageRating = computeAverageRating(store.ratings);

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        ratingsCount: store.ratings.length,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      },
      ratings: store.ratings.map((item) => ({
        rating: item.rating,
        ratedAt: item.updatedAt,
        user: item.user,
      })),
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);
    return res.status(500).json({ message: "Failed to fetch owner dashboard." });
  }
}
