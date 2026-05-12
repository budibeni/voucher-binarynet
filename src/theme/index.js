import { DefaultTheme } from 'react-native-paper';

export const COLORS = {
  // Primary — modern red
  primary: '#DC2626',
  primaryDark: '#B91C1C',
  primaryLight: '#EF4444',
  primarySurface: '#FEF2F2',
  primaryBorder: '#FECACA',

  // Neutrals — slate system
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  // Text hierarchy
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textDisabled: '#CBD5E1',

  // Border
  border: '#E2E8F0',
  borderMuted: '#F1F5F9',

  // Semantic
  success: '#16A34A',
  successSurface: '#F0FDF4',
  info: '#1D4ED8',
  infoSurface: '#EFF6FF',
  warning: '#D97706',
  warningSurface: '#FFFBEB',
  danger: '#DC2626',
  dangerSurface: '#FEF2F2',

  white: '#FFFFFF',
  black: '#000000',

  // Navy accent
  navy: '#1E3A5F',
  navyLight: '#EFF6FF',
};

export const SHADOWS = {
  none: {},
  xs: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 28,
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    onPrimary: COLORS.white,
    outline: COLORS.border,
    elevation: {
      level0: 'transparent',
      level1: COLORS.surface,
      level2: COLORS.surface,
      level3: COLORS.surface,
      level4: COLORS.surface,
      level5: COLORS.surface,
    },
  },
  roundness: 12,
};
