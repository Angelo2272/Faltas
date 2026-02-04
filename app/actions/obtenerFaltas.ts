'use server'
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import User from '@/app/models/User'; // 👈 Necesitamos esto para buscar tu ID
import { auth } from '@/app/auth'; 

// Definimos el tipo de dato para el Frontend (actualizado a tu nuevo modelo)
export type FaltaFrontend = {
  id: string;
  materia: string;
  fecha: string;
  descripcion: string;
  justificado: boolean; // 👇 Cambiamos 'tipo' por 'justificado'
};

export async function obtenerFaltas(): Promise<FaltaFrontend[]> {
  await dbConnect();
  const session = await auth();

  // Si no hay sesión o email, devolvemos array vacío
  if (!session?.user?.email) return [];

  const usuarioEmail = session.user.email;

  // 1. Buscamos al usuario en la DB para obtener su _id
  // (Porque en la tabla de Faltas guardamos el ID, no el email)
  const usuarioDb = await User.findOne({ email: usuarioEmail });

  if (!usuarioDb) {
    return []; // Si el usuario no existe en la DB, no tiene faltas
  }

  // 2. Filtramos las faltas que tengan el ID de este usuario
  const filtro = { usuario: usuarioDb._id };

  // 3. Buscamos las faltas
  const faltas = await Falta.find(filtro).sort({ fecha: -1 }).lean();

  // 4. Mapeamos los datos para enviarlos al frontend
  // Nota: 'falta' aquí es de tipo any/unknown al usar lean(), así que forzamos el tipado si hace falta
  return faltas.map((falta: any) => ({
    id: (falta._id).toString(),
    materia: falta.materia,
    fecha: falta.fecha.toISOString(),
    descripcion: falta.descripcion || '', // Evitamos null
    justificado: falta.justificado // Boolean
  }));
}