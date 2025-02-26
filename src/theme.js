import { createTheme } from '@mui/material/styles';

const storedColor = localStorage.getItem('themeColor') || '#800000';

const theme = createTheme({
  palette: {
    primary: {
      main: storedColor,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
