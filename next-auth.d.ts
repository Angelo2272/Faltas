// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Extendemos la interfaz User para aceptar 'role' y 'id'
   */
  interface User {
    role?: string;
    id?: string;
  }

  /**
   * Extendemos la interfaz Session para que session.user tenga 'role' y 'id'
   */
  interface Session {
    user: {
      role?: string;
      id?: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendemos el JWT para guardar el rol dentro del token cifrado
   */
  interface JWT {
    role?: string;
    id?: string;
  }
}