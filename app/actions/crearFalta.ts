// app/actions/crearFalta.ts
'use server'

import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/app/lib/session'; // <--- Importas la nueva función

export async function crearFalta(formData: FormData) {
  // 1. Verificar sesión
  const session = await verifySession();

  // 2. Comprobar si hay usuario (userId viene del return de verifySession)
  if (!session || !session.userId) {
    return { error: "No autorizado" };
  }

  await dbConnect();

  const materia = formData.get('materia') as string;
  const descripcion = formData.get('descripcion') as string;
  const justificado = formData.get('justificado') === 'on';

  try {
    await Falta.create({
      materia,
      descripcion,
      justificado,
      usuario: session.userId, // <--- Usas el ID desencriptado
      fecha: new Date(),
    });

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.log(error);
    return { error: "Error al crear la falta" };
  }
}