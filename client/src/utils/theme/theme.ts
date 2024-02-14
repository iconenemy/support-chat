import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#d6b78f",
    },
    secondary: {
      main: "#00b3fe",
      contrastText: '#fff'
    },
    custom: {
      main: "#008efe",
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#fff'
    }
  },
});

// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
  interface Palette {
    custom: Palette['primary'];
  }

  interface PaletteOptions {
    custom?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    custom: true;
  }
}
