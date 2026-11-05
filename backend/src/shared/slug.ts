export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const makeSku = (slug: string, color: string, size: string) =>
  `${slug}-${color}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
