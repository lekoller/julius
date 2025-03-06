import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  const { colors, spacing } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.text.disabled;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outlined':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.text.disabled;
    if (variant === 'outlined') return colors.primary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.text.inverse;
    if (variant === 'outlined') return colors.primary;
    return colors.text.inverse;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return spacing.sm;
      case 'large':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  const buttonStyle = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderWidth: variant === 'outlined' ? 1 : 0,
      borderRadius: spacing.sm,
      padding: getPadding(),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.7 : 1,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyle.button, style]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          variant="button"
          color={getTextColor()}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}; 