/**
 * Theme configuration for Rhynk.
 * Tokens below are sourced directly from DESIGN.md (brand palette,
 * chat-bubble colors, typography scale, radii, spacing) — keep this file
 * in sync if that doc changes rather than hand-tuning values here.
 */

import { createTheme } from '@mui/material/styles';

export const colors = {
  // Brand
  primary: {
    main: '#5B4FE9', // electric indigo — buttons, links, active/selected states
    variant: '#8A7FFF', // dark-mode-legible variant of primary
  },
  accent: {
    main: '#00D9A3', // teal-mint — online dots, "live" room indicator, verified checks
  },
  success: {
    main: '#00D9A3',
  },
  error: {
    main: '#FF5B5B',
  },
  // Not specified in DESIGN.md — muted, desaturated so they don't compete
  // with the single indigo accent the doc calls for. Revisit if the design
  // system defines these explicitly.
  warning: {
    main: '#E0A22D',
  },
  info: {
    main: '#4FA3E0',
  },

  // Light mode
  text: {
    primary: '#14141A',
    secondary: '#8A8A93',
  },
  background: {
    default: '#F7F7FB',
    paper: '#FFFFFF',
  },
  divider: '#E6E6EC',

  // Dark mode
  dark: {
    text: {
      primary: '#F5F5F7',
      secondary: '#8A8A93',
    },
    background: {
      default: '#0E0E12',
      paper: '#1C1C22',
    },
    divider: '#2A2A31',
  },

  // Chat bubbles (light/dark share the sent-bubble color)
  bubble: {
    sent: {
      background: '#5B4FE9',
      text: '#FFFFFF',
    },
    received: {
      light: { background: '#EAE9F3', text: '#14141A' },
      dark: { background: '#1C1C22', text: '#F5F5F7' },
    },
  },

  // Doodle background motif — indigo at 4-6% opacity, tiled musical
  // notes/speech-bubbles/waveforms/dots (waveform-heavy in Music Room)
  doodle: {
    color: '#5B4FE9',
    opacityLight: 0.05,
    opacityDark: 0.06,
  },
};

export const typography = {
  fontFamily: 'Inter, Manrope, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  fontSize: {
    screenTitleLg: '1.75rem', // 28px
    screenTitle: '1.5rem', // 24px
    subheading: '1.125rem', // 18px
    body: '1rem', // 16px
    label: '0.875rem', // 14px
    caption: '0.8125rem', // 13px — captions, timestamps
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
};

export const zIndex = {
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Common theme configuration shared by both light and dark palettes
const getCommonThemeConfig = () => ({
  typography: {
    fontFamily: typography.fontFamily,
    h1: { fontSize: typography.fontSize.screenTitleLg, fontWeight: typography.fontWeight.bold },
    h2: { fontSize: typography.fontSize.screenTitle, fontWeight: typography.fontWeight.bold },
    subtitle1: { fontSize: typography.fontSize.subheading, fontWeight: typography.fontWeight.medium },
    body1: { fontSize: typography.fontSize.body, fontWeight: typography.fontWeight.regular },
    body2: { fontSize: typography.fontSize.label, fontWeight: typography.fontWeight.regular },
    caption: { fontSize: typography.fontSize.caption, fontWeight: typography.fontWeight.regular },
    button: { fontWeight: typography.fontWeight.medium, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12, // cards & inputs per DESIGN.md
  },
  spacing: (factor) => `${factor * 4}px`, // 4/8/12/16/24/32 scale
  zIndex,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: typography.fontWeight.medium,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // fully rounded pills
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: '50%',
        },
      },
    },
  },
});

// Create the MUI theme for a given mode, carrying Rhynk-specific tokens
// (bubble colors, doodle background) under palette.custom for components
// that need them (sx={{ bgcolor: 'custom.bubble.sent' }}, etc.)
export const createDynamicTheme = (isDarkMode = true) => {
  return createTheme({
    palette: /** @type {any} */ ({
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? colors.primary.variant : colors.primary.main,
        contrastText: '#FFFFFF',
      },
      success: {
        main: colors.success.main,
        contrastText: '#FFFFFF',
      },
      warning: {
        main: colors.warning.main,
        contrastText: '#000000',
      },
      error: {
        main: colors.error.main,
        contrastText: '#FFFFFF',
      },
      info: {
        main: colors.info.main,
        contrastText: '#FFFFFF',
      },
      text: isDarkMode
        ? {
            primary: colors.dark.text.primary,
            secondary: colors.dark.text.secondary,
          }
        : {
            primary: colors.text.primary,
            secondary: colors.text.secondary,
          },
      background: isDarkMode
        ? {
            default: colors.dark.background.default,
            paper: colors.dark.background.paper,
          }
        : {
            default: colors.background.default,
            paper: colors.background.paper,
          },
      divider: isDarkMode ? colors.dark.divider : colors.divider,
      custom: {
        accent: colors.accent.main,
        bubble: {
          sent: colors.bubble.sent,
          received: isDarkMode ? colors.bubble.received.dark : colors.bubble.received.light,
        },
        doodle: {
          color: colors.doodle.color,
          opacity: isDarkMode ? colors.doodle.opacityDark : colors.doodle.opacityLight,
        },
      },
    }),
    ...getCommonThemeConfig(),
  });
};

// Rhynk skews dark-mode-first per the PRD's own screenshots — default export
// is the dark theme; wrap the app with createDynamicTheme(false) for light.
export default createDynamicTheme(true);
