import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react' // <--- 1. Importante: Agregamos cache

const secretKey = process.env.SESSION_SECRET || 'mi_secreto_super_seguro'
const encodedKey = new TextEncoder().encode(secretKey)

// Tipado del payload del token
type SessionPayload = {
  userId: string
  role: string
  expiresAt: Date
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
  const session = await encrypt({ userId, role, expiresAt })

  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

// --- 2. AQUÍ ESTÁ LA FUNCIÓN QUE TE FALTABA ---
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return null
  }

  return { isAuth: true, userId: session.userId, role: session.role }
})
// ----------------------------------------------

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch (error) {
    // Si el token es inválido o expiró, retornamos null
    return null
  }
}