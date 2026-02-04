// app/models/Falta.ts
import mongoose, { Schema, model, models } from 'mongoose';

const FaltaSchema = new Schema({
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
  // 👇 TE FALTABA ESTO:
  justificado: {
    type: Boolean,
    default: false, // Por defecto asumimos que no está justificada
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Esto añade createdAt y updatedAt automáticamente
});

// Evitamos recompilar el modelo si ya existe (Hot Reload de Next.js)
const Falta = models.Falta || model('Falta', FaltaSchema);

export default Falta;