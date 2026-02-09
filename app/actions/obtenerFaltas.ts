'use server'
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
// import User from '@/app/models/User'; // 👈 YA NO LO NECESITAS AQUÍ
import { verifySession } from '@/app/lib/session'; // 1. Importamos verifySession

export type FaltaFrontend = {
  id: string;
  materia: string;
  fecha: string;
  descripcion: string;
  justificado: boolean;
};

export async function obtenerFaltas(): Promise<FaltaFrontend[]> {
  try {
    await dbConnect();
    
    // 2. Obtenemos la sesión manual
    const session = await verifySession();

    // 3. Verificamos si hay sesión y ID (ya no usamos email)
    if (!session || !session.userId) return [];

    // 4. Usamos session.userId DIRECTAMENTE (Ahorramos la consulta a User.findOne)
    const faltas = await Falta.find({ usuario: session.userId })
      .sort({ fecha: -1 })
      .lean();

    return faltas.map((falta: any) => ({
      id: (falta._id).toString(),
      materia: falta.materia,
      fecha: falta.fecha.toISOString(),
      descripcion: falta.descripcion || '',
      justificado: falta.justificado
    }));

  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN OBTENER FALTAS:", error);
    return []; 
  }
}