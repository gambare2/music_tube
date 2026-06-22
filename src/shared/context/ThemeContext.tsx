import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeType = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('theme') as ThemeType) || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Synchronized Material UI Theme
  const muiTheme = React.useMemo(() => {
    const isDark = theme === 'dark';
    return createTheme({
      palette: {
        mode: theme,
        primary: {
          main: '#1DB954', // Spotify Green
        },
        background: {
          default: isDark ? '#0F0F0F' : '#F9F9F9',
          paper: isDark ? '#181818' : '#FFFFFF',
        },
        text: {
          primary: isDark ? '#FFFFFF' : '#0F0F0F',
          secondary: isDark ? '#B3B3B3' : '#555555',
        },
        divider: isDark ? '#282828' : '#E5E5E5',
      },
      typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: isDark ? '#282828' : '#E5E5E5',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#535353' : '#B3B3B3',
              },
            },
          },
        },
      },
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
