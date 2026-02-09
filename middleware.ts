import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/app/lib/session'

export async function middleware(req: NextRequest) {
  // 1. Definir rutas protegidas
  const protectedRoutes = ['/dashboard', '/perfil']
  const publicRoutes = ['/login', '/register', '/']

  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // 2. Leer la cookie
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // 3. Redirigir si intenta entrar a ruta protegida sin sesión
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 4. (Opcional) Redirigir al dashboard si ya está logueado y va al login
  if (isPublicRoute && session?.userId && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Configuración para que no ejecute en estáticos
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}