'use client'

import { useState } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Chip, 
  Box, 
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress // 👈 Importamos la barra de progreso
} from '@mui/material';

// Iconos
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Icono de peligro

// Server Actions
import { eliminarFalta } from '@/app/actions/eliminarFalta';
import { eliminarMateria } from '@/app/actions/eliminarMateria'; 

interface Falta {
  _id: string;
  fecha: string | null;
  descripcion?: string;
  justificado: boolean;
}

interface ListaFaltasProps {
  faltasAgrupadas: Record<string, Falta[]>;
  materias: string[];
}

// --- CONSTANTE DEL LÍMITE ---
const MAX_FALTAS = 9; 

export default function ListaFaltas({ faltasAgrupadas, materias }: ListaFaltasProps) {
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'falta' | 'materia';
    idOrName: string;
    extraInfo?: string;
  } | null>(null);

  const clickBorrarFalta = (id: string) => {
    setDeleteTarget({ type: 'falta', idOrName: id });
    setDialogOpen(true);
  };

  const clickBorrarMateria = (e: React.MouseEvent, materia: string, cantidad: number) => {
    e.stopPropagation();
    setDeleteTarget({ type: 'materia', idOrName: materia, extraInfo: cantidad.toString() });
    setDialogOpen(true);
  };

  const confirmarBorrado = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'falta') await eliminarFalta(deleteTarget.idOrName);
    else await eliminarMateria(deleteTarget.idOrName);
    setDialogOpen(false);
    setDeleteTarget(null);
  };

  // Función para determinar el color y estado según las faltas
  const getEstadoMateria = (cantidad: number) => {
    const porcentaje = Math.min((cantidad / MAX_FALTAS) * 100, 100);
    
    if (cantidad >= MAX_FALTAS) {
      return { color: 'error' as const, texto: 'Reprobado por Faltas', porcentaje };
    } else if (cantidad >= MAX_FALTAS - 2) { // 7 u 8 faltas
      return { color: 'warning' as const, texto: 'En Riesgo', porcentaje };
    } else {
      return { color: 'primary' as const, texto: 'Normal', porcentaje };
    }
  };

  // Si no hay datos (Estado vacío)
  if (materias.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'background.paper', 
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2
        }} 
        elevation={0}
      >
        <Typography variant="body1" color="text.secondary">
          No tienes faltas registradas. ¡Sigue así! 🎉
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {materias.map((materia) => {
        const cantidad = faltasAgrupadas[materia].length;
        const estado = getEstadoMateria(cantidad);

        return (
          <Accordion 
            key={materia} 
            disableGutters 
            elevation={2} 
            sx={{ 
              mb: 2, 
              borderRadius: '8px !important', 
              overflow: 'hidden',
              borderLeft: cantidad >= MAX_FALTAS ? '6px solid #d32f2f' : 'none' // Borde rojo si reprobó
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' },
                '& .MuiAccordionSummary-content': { 
                  alignItems: 'center',
                  width: '100%',
                  mr: 1
                }
              }}
            >
              <Box sx={{ width: '100%' }}>
                
                {/* FILA SUPERIOR: Icono, Nombre y Botón Borrar */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {cantidad >= MAX_FALTAS ? <ErrorOutlineIcon color="error" /> : <FolderIcon color={estado.color} />}
                    
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', fontSize: '1rem', fontWeight: 'bold' }}>
                      {materia}
                    </Typography>

                    {/* Chip con el conteo X/9 */}
                    <Chip 
                      label={`${cantidad} / ${MAX_FALTAS}`} 
                      size="small" 
                      color={estado.color} 
                      variant={cantidad >= MAX_FALTAS ? "filled" : "outlined"} 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Tooltip title={`Eliminar carpeta ${materia}`}>
                    <IconButton 
                      onClick={(e) => clickBorrarMateria(e, materia, cantidad)}
                      size="small"
                      sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.light', opacity: 0.2 } }}
                    >
                      <DeleteSweepIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* BARRA DE PROGRESO */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 2 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={estado.porcentaje} 
                      color={estado.color}
                      sx={{ height: 8, borderRadius: 5, bgcolor: 'action.selected' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60, textAlign: 'right' }}>
                    {estado.texto}
                  </Typography>
                </Box>

              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: 'action.hover', p: 2 }}>
              <Stack spacing={2}>
                {/* Aviso si ya reprobó */}
                {cantidad >= MAX_FALTAS && (
                  <Paper sx={{ p: 2, bgcolor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }} elevation={0}>
                    <Typography variant="body2" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                      <WarningIcon fontSize="small" /> 
                      Has excedido el límite de faltas permitido (70% de asistencia).
                    </Typography>
                  </Paper>
                )}

                {faltasAgrupadas[materia].map((falta) => (
                  <Paper 
                    key={falta._id} 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 1
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <EventNoteIcon fontSize="small" color="action" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {falta.fecha ? new Date(falta.fecha).toLocaleDateString() : 'Sin fecha'}
                        </Typography>
                      </Box>
                      {falta.descripcion ? (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 3.5 }}>
                          {falta.descripcion}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.disabled" sx={{ ml: 3.5 }}>
                          Sin descripción
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' }}>
                      <Chip 
                        icon={falta.justificado ? <CheckCircleIcon /> : <WarningIcon />}
                        label={falta.justificado ? 'Justificada' : 'Injustificada'} 
                        color={falta.justificado ? 'success' : 'error'} 
                        variant="outlined"
                        size="small" 
                      />
                      <Tooltip title="Eliminar falta">
                        <IconButton 
                          onClick={() => clickBorrarFalta(falta._id)} 
                          color="error" 
                          size="small"
                          sx={{ opacity: 0.6, '&:hover': { opacity: 1, bgcolor: 'action.hover' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* --- DIÁLOGO DE CONFIRMACIÓN (Sin cambios) --- */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {deleteTarget?.type === 'materia' ? '¿Eliminar Carpeta?' : '¿Eliminar Falta?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteTarget?.type === 'materia' 
              ? `Estás a punto de eliminar la materia "${deleteTarget.idOrName}" y todas sus ${deleteTarget.extraInfo} faltas registradas. Esta acción no se puede deshacer.`
              : `¿Estás seguro de que quieres eliminar esta falta del registro?`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={confirmarBorrado} color="error">Sí, eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}