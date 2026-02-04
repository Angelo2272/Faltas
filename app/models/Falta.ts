// app/models/Falta.ts
import mongoose, { Schema, Document, Model, model, models } from 'mongoose';

// 👇 ESTA ES LA PARTE IMPORTANTE QUE TE FALTABA
// Definimos la forma de los datos (Interfaz) y la EXPORTAMOS para poder usarla fuera
export interface IFalta extends Document {
  usuario: mongoose.Types.ObjectId; // Referencia al ID del usuario
  materia: string;
  descripcion?: string; // El signo ? significa que es opcional
  justificado: boolean;
  fecha: Date;
  createdAt?: Date; // Se crean solos por timestamps: true
  updatedAt?: Date;
}

// 👇 Definimos el esquema de Mongoose usando la interfaz
const FaltaSchema = new Schema<IFalta>({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  materia: {
    type: String,
    required: [true, 'La materia es obligatoria'],
  },
  descripcion: {
    type: String,
  },
  justificado: {
    type: Boolean,
    default: false, 
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Esto añade createdAt y updatedAt automáticamente
});

// 👇 Evitamos recompilar el modelo si ya existe (Hot Reload de Next.js)
const Falta = (models.Falta as Model<IFalta>) || model<IFalta>('Falta', FaltaSchema);

export default Falta;