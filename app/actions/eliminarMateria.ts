'use server'

import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/app/lib/session'; // 1. Cambiamos el import

export async function eliminarMateria(nombreMateria: string) {
  // 2. Obtenemos la sesión manual
  const session = await verifySession();

  // 3. Verificamos usando session.userId
  if (!session || !session.userId) {
    return { error: "No autorizado" };
  }

  await dbConnect();

  try {
    // 4. Usamos session.userId para borrar solo las del usuario actual
    const resultado = await Falta.deleteMany({ 
      materia: nombreMateria, 
      usuario: session.userId 
    });

    if (resultado.deletedCount === 0) {
      return { error: "No se encontraron faltas para borrar" };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    return { error: "Error al eliminar la materia" };
  }
}