// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/app/lib/dbConnect"
import User from "@/app/models/User"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Definimos la estrategia de sesión como JWT (JSON Web Token)
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Esta función se ejecuta al intentar loguearse
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Conectar a la Base de Datos
        await dbConnect();

        // 2. Buscar al usuario
        // Usamos .select('+password') porque en el Modelo definimos que el password no venga por defecto
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          throw new Error("Usuario no encontrado"); // O retorna null
        }

        // 3. Verificar la contraseña
        // ⚠️ NOTA IMPORTANTE: Ahora comparamos texto plano para que te funcione con el código anterior.
        // En una app real, aquí usarías: const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        const isMatch = user.password === credentials.password;

        if (!isMatch) {
          throw new Error("Contraseña incorrecta");
        }

        // 4. Si todo es correcto, devolvemos el objeto usuario
        // Estos datos se pasarán al callback 'jwt'
        return {
          id: user._id.toString(), // Convertimos el ObjectId de Mongo a String
          name: user.name,
          email: user.email,
          role: user.role, // Pasamos el rol (ADMIN/STUDENT)
        };
      },
    }),
  ],

  callbacks: {
    // Paso 1: El usuario se loguea -> Los datos se guardan en el Token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Paso 2: El cliente pide la sesión -> Le pasamos los datos del Token a la Sesión
    async session({ session, token }) {
      if (session.user) {
        // Asignamos los valores personalizados
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  // Configuración opcional de páginas
  pages: {
    signIn: '/', // Si hay error de auth, redirige al inicio (donde está tu formulario)
  }
})