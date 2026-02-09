'use client'
import { useState } from 'react';
import { login, register } from '@/app/actions/auth-actions';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // Switch entre Login/Registro
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Elegimos qué acción ejecutar
    const action = isLogin ? login : register;
    
    // Ejecutamos la Server Action
    const result = await action(formData);
    
    // Si hay error (y no redireccionó), lo mostramos
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      
      {/* --- ENCABEZADO --- */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </h2>
        <p className="text-gray-500 mt-2">
          {isLogin ? 'Ingresa para ver tus faltas' : 'Regístrate para empezar'}
        </p>
      </div>

      {/* --- FORMULARIO --- */}
      <form action={handleSubmit} className="space-y-4">
        
        {/* Nombre (Solo en Registro) */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-black mb-1">Nombre</label>
            <input 
              name="name" type="text" placeholder="Tu nombre" required 
              className="w-full px-4 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input 
            name="email" type="email" placeholder="correo@ejemplo.com" required 
            className="w-full px-4 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Contraseña</label>
          <input 
            name="password" type="password" placeholder="••••••••" required 
            className="w-full px-4 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Botón Submit */}
        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
        </button>
      </form>

      {/* --- SWITCH LOGIN / REGISTRO --- */}
      <div className="mt-6 text-center text-sm text-black-600">
        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <button 
          onClick={() => { setIsLogin(!isLogin); setError(null); }}
          className="text-blue-600 font-semibold hover:underline"
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </div>

    </div>
  );
}