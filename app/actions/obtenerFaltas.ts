// app/actions/obtenerFaltas.ts
'use server'
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import { auth } from '@/app/auth'; 

// Definimos el tipo de dato que recibirá el Frontend (todo serializado)
export type FaltaFrontend = {
  id: string;
  materia: string;
  fecha: string;
  descripcion: string;
  tipo: string;
};

export async function obtenerFaltas(): Promise<FaltaFrontend[]> {
  await dbConnect();
  const session = await auth();

  if (!session?.user?.email) return [];

  const MI_EMAIL_ADMIN = 'tu_email@gmail.com'; 
  const usuarioActual = session.user.email;

  const filtro = usuarioActual === MI_EMAIL_ADMIN 
    ? {} 
    : { emailUsuario: usuarioActual };

  // Usamos .lean() para obtener objetos JS planos, no documentos Mongoose pesados
  const faltas = await Falta.find(filtro).sort({ fecha: -1 }).lean();

  // Mapeamos para cumplir con la interfaz FaltaFrontend
  return faltas.map((falta) => ({
    id: (falta._id as any).toString(), // _id a string
    materia: falta.materia,
    fecha: falta.fecha.toISOString(), // Date a string
    descripcion: falta.descripcion,
    tipo: falta.tipo
  }));
}