import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      marginBottom: spacing.xs,
    },
    input: {
      ...typography.body1,
      backgroundColor: colors.background.paper,
      borderWidth: 1,
      borderColor: error ? colors.text.error : colors.text.secondary,
      borderRadius: spacing.xs,
      padding: spacing.sm,
      color: colors.text.primary,
    },
    error: {
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="subtitle2"
          style={styles.label}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.disabled}
        {...props}
      />
      {error && (
        <Text
          variant="caption"
          color={colors.text.error}
          style={styles.error}
        >
          {error}
        </Text>
      )}
    </View>
  );
}; 