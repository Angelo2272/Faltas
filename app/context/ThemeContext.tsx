'use client'

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({ 
  toggleColorMode: () => {},
  mode: 'light'
});

export const useColorMode = () => useContext(ColorModeContext);

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  // 👇 ESTADO NUEVO: Para saber si ya estamos en el navegador
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Marcamos que ya estamos montados en el cliente
    setMounted(true);

    // 2. Ahora es seguro leer localStorage o window
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? { background: { default: '#f3f4f6', paper: '#ffffff' } }
            : { background: { default: '#121212', paper: '#1e1e1e' } }),
        },
      }),
    [mode],
  );

  // 👇 SI AÚN NO ESTAMOS MONTADOS, DEVOLVEMOS UN DIV INVISIBLE O NULL
  // Esto evita que el servidor y el cliente se peleen por el CSS
  if (!mounted) {
    return <>{children}</>; 
    // Nota: Retornar solo children sin ThemeProvider podría verse feo 0.1s, 
    // pero evita el CRASH. Si da error de estilos, cambia esta línea por: return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}