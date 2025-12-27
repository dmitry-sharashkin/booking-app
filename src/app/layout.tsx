// src/app/layout.tsx
"use client"; // ←←← ЭТО ОБЯЗАТЕЛЬНО

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = makeStore();

  return (
    <html lang="ru">
      <body>
        <Provider store={store}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}
