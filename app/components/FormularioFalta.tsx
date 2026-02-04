'use client'

import { crearFalta } from '@/app/actions/crearFalta';
import { useRef, useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Snackbar, 
  Alert 
} from '@mui/material';
// Usamos Grid2 como corregimos antes
import Grid from '@mui/material/Grid'; 
import SaveIcon from '@mui/icons-material/Save';

export default function FormularioFalta() {
  const formRef = useRef<HTMLFormElement>(null);

  // --- 1. ESTADO PARA LA NOTIFICACIÓN ---
  const [toast, setToast] = useState({
    open: false,
    mensaje: '',
    tipo: 'success' as 'success' | 'error'
  });

  // Función para cerrar la notificación
  const handleClose = () => {
    setToast({ ...toast, open: false });
  };

  async function handleAction(formData: FormData) {
    const resultado = await crearFalta(formData);
    
    if (resultado?.success) {
      formRef.current?.reset();
      // --- 2. MOSTRAMOS ÉXITO ---
      setToast({
        open: true,
        mensaje: '¡Falta registrada correctamente!',
        tipo: 'success'
      });
    } else {
      // --- 3. MOSTRAMOS ERROR ---
      setToast({
        open: true,
        mensaje: "Error: " + (resultado?.error || "No se pudo guardar"),
        tipo: 'error'
      });
    }
  }

  return (
    <>
      <Box 
        component="form" 
        ref={formRef} 
        action={handleAction} 
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="materia"
              label="Materia"
              placeholder="Ej: Matemáticas"
              required
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="descripcion"
              label="Motivo / Descripción"
              placeholder="Ej: Llegada tarde"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={<Checkbox name="justificado" color="primary" />}
              label="¿Está justificada?"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              startIcon={<SaveIcon />}
              size="large"
            >
              Registrar Falta
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* --- 4. EL COMPONENTE DE NOTIFICACIÓN (SNACKBAR) --- */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} // Se cierra solo a los 4 segundos
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Sale abajo a la derecha
      >
        <Alert 
          onClose={handleClose} 
          severity={toast.tipo} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {toast.mensaje}
        </Alert>
      </Snackbar>
    </>
  );
}