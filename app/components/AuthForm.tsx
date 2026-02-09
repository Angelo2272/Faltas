'use client'
import { useState } from 'react';
import { login, register } from '@/app/actions/auth-actions';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const action = isLogin ? login : register;
    
    const result = await action(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </h2>
        <p className="text-gray-500 mt-2">
          {isLogin ? 'Ingresa para ver tus faltas' : 'Regístrate para empezar'}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        
        {/* Nombre */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              name="name" type="text" placeholder="Tu nombre" required 
              // 👇 AQUÍ AGREGUÉ "text-black" y corregí el borde
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            name="email" type="email" placeholder="correo@ejemplo.com" required 
            // 👇 AQUÍ AGREGUÉ "text-black"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            name="password" type="password" placeholder="••••••••" required 
            // 👇 AQUÍ AGREGUÉ "text-black"
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
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