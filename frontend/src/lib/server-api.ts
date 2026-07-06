export function getApiBaseUrl() {
  if (process.env.API_BASE_URL) return process.env.API_BASE_URL;
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fallback em produção na Vercel quando a env ainda não foi configurada
  if (process.env.VERCEL) return "https://vzgym-production.up.railway.app";

  return "http://localhost:3002";
}
