export const colors = {
  primary: '#2E7D32', // Green 800
  primaryLight: '#4CAF50', // Green 500
  primaryDark: '#1B5E20', // Green 900
  secondary: '#FF9800', // Orange 500
  secondaryLight: '#FFB74D', // Orange 300
  secondaryDark: '#F57C00', // Orange 700
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#D32F2F',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    inverse: '#FFFFFF',
  },
  divider: '#BDBDBD',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
} as const;

export type Colors = typeof colors; 