import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

export const api = axios.create({
  baseURL: API_BASE,
});
