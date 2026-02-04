'use server'
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta'; // Asegúrate de que este import coincida con tu archivo real
import User from '@/app/models/User';
import { auth } from '@/app/auth'; 

export type FaltaFrontend = {
  id: string;
  materia: string;
  fecha: string;
  descripcion: string;
  justificado: boolean;
};

export async function obtenerFaltas(): Promise<FaltaFrontend[]> {
  // 👇 INICIO DEL CHALECO ANTIBALAS
  try {
    await dbConnect(); // Intentamos conectar
    const session = await auth();

    // Si no hay usuario, devolvemos array vacío sin dar error
    if (!session?.user?.email) return [];

    const usuarioDb = await User.findOne({ email: session.user.email });
    
    // Si el usuario no está en la DB, array vacío
    if (!usuarioDb) return [];

    const faltas = await Falta.find({ usuario: usuarioDb._id }).sort({ fecha: -1 }).lean();

    return faltas.map((falta: any) => ({
      id: (falta._id).toString(),
      materia: falta.materia,
      fecha: falta.fecha.toISOString(),
      descripcion: falta.descripcion || '',
      justificado: falta.justificado
    }));

  } catch (error) {
    // 👇 SI ALGO EXPLOTA (DB caída, contraseña mal, etc.)
    console.error("❌ ERROR CRÍTICO EN OBTENER FALTAS:", error);
    // Devolvemos lista vacía para que la página NO DE 404
    return []; 
  }
}