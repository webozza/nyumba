import React from 'react';
//mui
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { } from '@mui/lab/themeAugmentation';
import { AppRoutes } from './Routes';
import { useThemeContext } from './lib/context/ThemeContext';
//pages

const App: React.FC = () => {
  const { theme } = useThemeContext()
  let nyumba_theme = createTheme(theme)
  nyumba_theme = responsiveFontSizes(nyumba_theme);

  return (
    <ThemeProvider theme={nyumba_theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App