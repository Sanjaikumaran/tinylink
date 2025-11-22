export const CODE_REGEX = /^[A-Za-z0-9]+$/;

export function generateRandomCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function normalizeUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}
