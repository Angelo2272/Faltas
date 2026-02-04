// app/actions/crearFalta.ts
'use server'

import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { auth } from '@/app/auth';
import { revalidatePath } from 'next/cache';

export async function crearFalta(formData: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { error: "No autorizado" };
  }

  await dbConnect();

  // 👇 AQUÍ ESTÁ EL CAMBIO: Añadimos "as string"
  const materia = formData.get('materia') as string;
  const descripcion = formData.get('descripcion') as string;
  
  // El checkbox devuelve 'on' si está marcado, o null si no lo está.
  const justificado = formData.get('justificado') === 'on';

  try {
    await Falta.create({
      materia,
      descripcion,
      justificado,
      usuario: session.user.id,
      fecha: new Date(),
    });

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.log(error);
    return { error: "Error al crear la falta" };
  }
}