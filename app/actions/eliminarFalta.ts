'use server'

import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/app/lib/session'; // 1. Cambiamos el import

export async function eliminarFalta(idFalta: string) {
  // 2. Obtenemos la sesión manual
  const session = await verifySession();

  // 3. Verificamos usando session.userId
  if (!session || !session.userId) {
    return { error: "No autorizado" };
  }

  await dbConnect();

  try {
    // Buscamos y borramos asegurando que sea del usuario actual
    const resultado = await Falta.findOneAndDelete({ 
      _id: idFalta, 
      usuario: session.userId // 4. Usamos el ID correcto
    });

    if (!resultado) {
      return { error: "Falta no encontrada o no tienes permiso" };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    return { error: "Error al eliminar" };
  }
}