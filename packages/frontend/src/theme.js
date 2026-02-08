import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B4D4FF', // Pastel Blue
      contrastText: '#6B6B6B', // Soft Charcoal
    },
    secondary: {
      main: '#E6D5F7', // Pastel Lavender
      contrastText: '#6B6B6B',
    },
    success: {
      main: '#C8E6C9', // Pastel Green
      contrastText: '#6B6B6B',
    },
    error: {
      main: '#FFB3B3', // Pastel Coral
      contrastText: '#6B6B6B',
    },
    warning: {
      main: '#FFE5CC', // Pastel Peach
      contrastText: '#6B6B6B',
    },
    info: {
      main: '#FFD6E8', // Pastel Pink
      contrastText: '#6B6B6B',
    },
    background: {
      default: '#FFFEF9', // Light Cream
      paper: '#F8F9FA', // Soft White
    },
    text: {
      primary: '#6B6B6B', // Soft Charcoal
      secondary: '#9E9E9E', // Medium Gray
    },
    divider: '#E8E8E8', // Light Gray
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '32px',
      fontWeight: 500,
      color: '#6B6B6B',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      color: '#6B6B6B',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 500,
      color: '#6B6B6B',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      color: '#6B6B6B',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      color: '#9E9E9E',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      color: '#9E9E9E',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E8E8E8',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
