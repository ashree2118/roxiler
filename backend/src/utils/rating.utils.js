export function computeAverageRating(ratings) {
  if (!ratings?.length) {
    return null;
  }

  const sum = ratings.reduce((total, item) => total + item.rating, 0);
  return Number((sum / ratings.length).toFixed(2));
}

export function parseSortOrder(value) {
  return value?.toLowerCase() === "desc" ? "desc" : "asc";
}

export function buildTextFilter(value) {
  if (!value) {
    return undefined;
  }

  return { contains: value, mode: "insensitive" };
}
