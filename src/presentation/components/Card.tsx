import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  elevation = 2,
}) => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background.paper,
      borderRadius: spacing.sm,
      padding: spacing.md,
      shadowColor: colors.text.primary,
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.25,
      shadowRadius: elevation,
      elevation: elevation,
    },
  });

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}; 