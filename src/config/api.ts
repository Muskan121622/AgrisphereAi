import { API_BASE_URL } from '@/config/api';
// Central API URL config — change VITE_API_URL in .env or Vercel/Render env vars
export const API_BASE_URL = import.meta.env.VITE_API_URL || "${API_BASE_URL}";

