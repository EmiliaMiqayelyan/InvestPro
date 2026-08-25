export function paginate<T>(items: T[], page = 1, limit = 10) {
  const safePage = Math.max(1, page || 1);
  const safeLimit = Math.max(1, Math.min(100, limit || 10));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const start = (safePage - 1) * safeLimit;
  return {
    data: items.slice(start, start + safeLimit),
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}
