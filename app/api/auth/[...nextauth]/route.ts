import { handlers } from "@/app/auth"; // <--- Importamos 'handlers' de tu archivo auth.ts

// Exportamos las funciones GET y POST.
// Esto permite que Next.js maneje automáticamente las URLs como:
// /api/auth/signin, /api/auth/signout, /api/auth/callback, etc.
export const { GET, POST } = handlers;