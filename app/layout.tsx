// app/layout.tsx
import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProviderWrapper } from "@/app/context/ThemeContext";
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
           <ThemeProviderWrapper>
              {children}
           </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}