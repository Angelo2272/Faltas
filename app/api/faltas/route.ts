// app/api/faltas/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/app/auth'; // <--- Importamos la sesión de NextAuth
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';

// ----------------------------------------------------------------------
// GET: Obtener SOLO las faltas del usuario logueado
// ----------------------------------------------------------------------
export async function GET() {
  try {
    // 1. Verificar sesión (Seguridad)
    const session = await auth();
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();

    // 2. Buscar en la BD filtrando por el ID del usuario
    const faltas = await Falta.find({ usuario: session.user.id })
      .sort({ fecha: -1 }); // Ordenar: las más recientes primero

    return NextResponse.json(faltas);

  } catch (error) {
    console.error("Error obteniendo faltas:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// POST: Crear una nueva falta asignada al usuario logueado
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    // 1. Verificar sesión
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    await dbConnect();

    // 2. Leer los datos que vienen del formulario
    const body = await req.json();

    // 3. Crear la falta INYECTANDO el ID del usuario (evita fraudes)
    const nuevaFalta = await Falta.create({
      ...body,                  // materia, fecha, justificado, etc.
      usuario: session.user.id  // <--- ¡Esto es lo más importante!
    });

    return NextResponse.json(nuevaFalta, { status: 201 });

  } catch (error) {
    console.error("Error creando falta:", error);
    return NextResponse.json({ error: 'Error al registrar la falta' }, { status: 400 });
  }
}