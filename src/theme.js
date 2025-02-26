// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#800000', // Maroon color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Optional: Remove uppercase transformation if desired.
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
