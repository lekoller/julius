import React, { createContext, useContext } from 'react';
import { typography, Typography } from './typography';
import { useTheme as usePaperTheme } from 'react-native-paper';

interface Colors {
  primary: string;
  secondary: string;
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
    error: string;
  };
}

interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
}

const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const ThemeContext = createContext<Theme | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const paperTheme = usePaperTheme();

  const theme: Theme = {
    colors: {
      primary: paperTheme.colors.primary,
      secondary: paperTheme.colors.secondary,
      background: {
        default: paperTheme.colors.background,
        paper: paperTheme.colors.surface,
      },
      text: {
        primary: paperTheme.colors.onSurface,
        secondary: paperTheme.colors.onSurfaceVariant,
        disabled: paperTheme.colors.onSurfaceDisabled,
        inverse: paperTheme.colors.onPrimary,
        error: paperTheme.colors.error,
      },
    },
    typography,
    spacing,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 