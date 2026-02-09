// app/api/faltas/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { verifySession } from '@/app/lib/session'; // 1. Importamos verifySession

// ----------------------------------------------------------------------
// GET: Obtener SOLO las faltas del usuario logueado
// ----------------------------------------------------------------------
export async function GET() {
  try {
    // 2. Verificar sesión manual
    const session = await verifySession();
    
    // 3. Usamos session.userId
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();

    // 4. Filtrar por session.userId
    const faltas = await Falta.find({ usuario: session.userId })
      .sort({ fecha: -1 });

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
    // 1. Verificar sesión manual
    const session = await verifySession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();

    const nuevaFalta = await Falta.create({
      ...body,
      usuario: session.userId  // 2. Usamos el ID correcto de la sesión
    });

    return NextResponse.json(nuevaFalta, { status: 201 });

  } catch (error) {
    console.error("Error creando falta:", error);
    return NextResponse.json({ error: 'Error al registrar la falta' }, { status: 400 });
  }
}