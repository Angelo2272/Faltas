'use client'

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Definimos la forma de nuestro contexto
interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({ 
  toggleColorMode: () => {},
  mode: 'light'
});

// Hook para usar el contexto fácilmente en cualquier componente
export const useColorMode = () => useContext(ColorModeContext);

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  // Estado para el modo (empezamos en light por defecto)
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Intentamos leer la preferencia del usuario al cargar (opcional, persistencia básica)
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Si el sistema operativo del usuario está en oscuro, lo respetamos
      setMode('dark');
    }
  }, []);

  // Función para cambiar el modo
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode); // Guardamos la preferencia
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  // Creamos el tema de MUI dinámicamente
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Puedes personalizar colores aquí si quieres
          ...(mode === 'light'
            ? {
                // Colores para modo claro
                background: { default: '#f3f4f6', paper: '#ffffff' },
              }
            : {
                // Colores para modo oscuro
                background: { default: '#121212', paper: '#1e1e1e' },
              }),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline es VITAL: resetea el CSS y pone el color de fondo oscuro global */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}