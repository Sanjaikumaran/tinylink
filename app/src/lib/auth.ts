export function isLoggedIn() {
  return typeof document !== "undefined" && document.cookie.includes("token=");
}
