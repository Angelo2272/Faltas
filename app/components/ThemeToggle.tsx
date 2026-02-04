'use client'

import { useColorMode } from '@/app/context/ThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Luna
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sol

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title={mode === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
      <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}