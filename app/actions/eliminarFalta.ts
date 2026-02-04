'use server'

import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { auth } from '@/app/auth';
import { revalidatePath } from 'next/cache';

export async function eliminarFalta(idFalta: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { error: "No autorizado" };
  }

  await dbConnect();

  try {
    // Buscamos y borramos, asegurando que la falta pertenezca al usuario logueado
    const resultado = await Falta.findOneAndDelete({ 
      _id: idFalta, 
      usuario: session.user.id 
    });

    if (!resultado) {
      return { error: "Falta no encontrada o no tienes permiso" };
    }

    // Recargamos la pantalla para que desaparezca al instante
    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    return { error: "Error al eliminar" };
  }
}