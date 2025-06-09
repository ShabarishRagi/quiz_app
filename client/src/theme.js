import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#8F88FF',
      dark: '#4A43D6',
    },
    secondary: {
      main: '#FF6584',
      light: '#FF8BA3',
      dark: '#D64A6A',
    },
    background: {
      default: '#1A1B1E',
      paper: '#2C2D31',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#FFFFFF',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#FFFFFF',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#FFFFFF',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#A0A0A0',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 15px rgba(108, 99, 255, 0.2)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(108, 99, 255, 0.3)',
            background: 'linear-gradient(135deg, #5A52E0 0%, #E64A6A 100%)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          background: 'transparent',
          border: '2px solid #6C63FF',
          color: '#6C63FF',
          '&:hover': {
            background: 'rgba(108, 99, 255, 0.1)',
            border: '2px solid #8F88FF',
            color: '#8F88FF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(44, 45, 49, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(44, 45, 49, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#6C63FF',
          '&.Mui-checked': {
            color: '#FF6584',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#6C63FF',
          '&.Mui-checked': {
            color: '#FF6584',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
}); 