'use server'

import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { auth } from '@/app/auth';
import { revalidatePath } from 'next/cache';

export async function eliminarMateria(nombreMateria: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { error: "No autorizado" };
  }

  await dbConnect();

  try {
    // BORRADO MASIVO: Borra todas las faltas que coincidan con la materia y el usuario
    const resultado = await Falta.deleteMany({ 
      materia: nombreMateria, 
      usuario: session.user.id 
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