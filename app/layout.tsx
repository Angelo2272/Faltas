import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProviderWrapper } from "@/app/context/ThemeContext"; // 👈 Importamos nuestro wrapper
import "./globals.css";

export const metadata: Metadata = {
  title: "Control de Asistencias",
  description: "App de gestión de faltas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
           {/* 👇 Sustituimos el ThemeProvider antiguo por nuestro Wrapper inteligente */}
           <ThemeProviderWrapper>
              {children}
           </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}