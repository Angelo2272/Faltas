import { auth } from '@/app/auth'; 
import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import FormularioFalta from '@/app/components/FormularioFalta';
import ListaFaltas from '@/app/components/ListaFaltas';
import ThemeToggle from '@/app/components/ThemeToggle'; // 👈 1. IMPORTAMOS EL TOGGLE
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

// --- Funciones auxiliares ---
function serializarFaltas(faltas: any[]) {
  return faltas.map(falta => ({
    _id: falta._id.toString(),
    materia: falta.materia,
    fecha: falta.fecha ? new Date(falta.fecha).toISOString() : null,
    justificado: falta.justificado,
    descripcion: falta.descripcion,
  }));
}

function agruparPorMateria(listaFaltas: any[]) {
  const grupos: Record<string, any[]> = {};
  listaFaltas.forEach(falta => {
    if (!grupos[falta.materia]) grupos[falta.materia] = [];
    grupos[falta.materia].push(falta);
  });
  return grupos;
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/');
  }

  await dbConnect();
  
  // Obtenemos faltas del usuario
  const faltasRaw = await Falta.find({ usuario: session.user.id }).sort({ fecha: -1 });
  const faltas = serializarFaltas(faltasRaw);
  const faltasAgrupadas = agruparPorMateria(faltas);
  const materias = Object.keys(faltasAgrupadas);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Control de Asistencias
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bienvenido, {session.user.name}
          </Typography>
        </Box>

        {/* 2. AGRUPAMOS LOS BOTONES DE ACCIÓN (MODO OSCURO Y SALIR) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          {/* Botón Sol/Luna */}
          <ThemeToggle />

          <form action={async () => {
            "use server"
            // Nota: Asegúrate de que la ruta sea correcta según tu proyecto (@/auth o @/app/auth)
            const { signOut } = await import("@/app/auth")
            await signOut()
          }}>
            <Button color="error" endIcon={<LogoutIcon />} type="submit">
              Salir
            </Button>
          </form>

        </Box>
      </Box>

      {/* SECCIÓN 1: FORMULARIO */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Registrar Nueva Falta
        </Typography>
        <FormularioFalta />
      </Paper>

      {/* SECCIÓN 2: LISTA ACORDEÓN (MUI) */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
          Tu Historial por Materias
        </Typography>
        {/* Aquí pasamos los datos al componente visual */}
        <ListaFaltas faltasAgrupadas={faltasAgrupadas} materias={materias} />
      </Box>

    </Container>
  );
}