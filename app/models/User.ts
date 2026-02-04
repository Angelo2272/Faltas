// app/models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Interfaz de TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // <--- Nuevo campo para Credentials Login
  image?: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: Date;
  updatedAt: Date;
}

// 2. Esquema de Mongoose
const UserSchema: Schema<IUser> = new Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'], 
    unique: true,
    lowercase: true, // Guarda siempre en minúsculas para evitar errores
    trim: true 
  },
  password: { 
    type: String, 
    // select: false hace que cuando busques un usuario, la contraseña NO venga 
    // por defecto (por seguridad). Solo la pedimos explícitamente al loguear.
    select: false 
  },
  image: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'STUDENT'], 
    default: 'STUDENT' 
  },
}, { 
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

// 3. Exportación (Evita error de recompilación en Next.js)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;