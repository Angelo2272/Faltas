'use server'
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';
import { signIn } from '@/app/auth'; // Tu archivo de NextAuth
import { AuthError } from 'next-auth';

// --- ACCIÓN DE REGISTRO ---
export async function register(formData: FormData) {
  await dbConnect();
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !name) return { error: "Faltan datos" };

  // 1. Verificar si ya existe
  const existe = await User.findOne({ email });
  if (existe) return { error: "El usuario ya existe" };

  // 2. Crear usuario (En app real, encripta el password con bcrypt aquí)
  await User.create({ name, email, password, role: 'STUDENT' });

  // 3. Auto-login después de registrarse (Opcional)
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Error al iniciar sesión auto" };
    throw error; // Necesario para que el redirect funcione
  }
}

// --- ACCIÓN DE LOGIN ---
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Esto llama a tu configuración de auth.ts
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': return { error: "Credenciales incorrectas" };
        default: return { error: "Algo salió mal" };
      }
    }
    throw error;
  }
}