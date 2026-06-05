// import { useColorScheme } from 'react-native'; // Not currently used

// Dark theme colors
export const darkColors = {
  appBg: '#000',
  background: '#000',
  card: '#0b0f17',
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  textMuted: '#eaeaea',
  border: '#1f2937',
  primary: '#93c5fd',
  tabInactive: '#64748b',
  success: '#22c55e',
  liveText: '#ff6b35',
  liveBackground: '#ff6b3520',
  commentaryText: '#fbbf24',
  lightYellow: '#eaae54',
  transparent: 'transparent',
};

// Hook to get current theme colors
export const useThemeColors = () => {
  // For now, always return dark colors as the app seems to be designed for dark theme
  // Can be extended later to support light theme
  return darkColors;
};

// Default export for backward compatibility
export const colors = darkColors;
export default colors;
