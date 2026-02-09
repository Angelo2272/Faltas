import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/dbConnect';
import Falta from '@/app/models/Falta';
import User from '@/app/models/User'; // 1. Importamos el modelo User para sacar el nombre
import FormularioFalta from '@/app/components/FormularioFalta';
import ListaFaltas from '@/app/components/ListaFaltas';
import ThemeToggle from '@/app/components/ThemeToggle'; 
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

// 👇 2. IMPORTAMOS NUESTRA AUTENTICACIÓN MANUAL
import { verifySession, deleteSession } from '@/app/lib/session';

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
  // 👇 3. REEMPLAZO DE NEXTAUTH
  const session = await verifySession();
  
  // Verificamos si hay sesión y si tiene userId
  if (!session || !session.userId) {
    redirect('/login');
  }

  await dbConnect();
  
  // 👇 4. RECUPERAR DATOS DEL USUARIO (NOMBRE)
  // Como la cookie solo tiene el ID, buscamos el nombre en la DB
  const usuarioInfo = await User.findById(session.userId).select('name');
  const nombreUsuario = usuarioInfo?.name || 'Estudiante';

  // 👇 5. USAMOS session.userId EN LA CONSULTA
  const faltasRaw = await Falta.find({ usuario: session.userId }).sort({ fecha: -1 });
  
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
            Bienvenido, {nombreUsuario} {/* Usamos la variable que buscamos arriba */}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          <ThemeToggle />

          {/* 👇 6. LOGOUT MANUAL */}
          <form action={async () => {
            "use server"
            await deleteSession(); // Borra la cookie
            redirect('/login');    // Redirige al login
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

      {/* SECCIÓN 2: LISTA */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
          Tu Historial por Materias
        </Typography>
        <ListaFaltas faltasAgrupadas={faltasAgrupadas} materias={materias} />
      </Box>

    </Container>
  );
}