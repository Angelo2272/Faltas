// app/page.tsx
import AuthForm from '@/app/components/AuthForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      
      {/* Logo o Icono flotante */}
      <div className="mb-8 text-6xl animate-bounce">
        🎓
      </div>

      {/* El Formulario Componente */}
      <AuthForm />

      {/* Footer sencillo */}
      <p className="mt-8 text-xs text-gray-400">
        Sistema de Control de Asistencias v1.0
      </p>

    </main>
  );
}