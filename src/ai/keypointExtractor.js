export const extractKeypoints = (text) => {
  if (!text) return [];

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
};
