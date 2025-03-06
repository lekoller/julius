import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Typography } from '../theme/typography';

type VariantKey = keyof Typography;

interface TextProps {
  children: React.ReactNode;
  variant?: VariantKey;
  color?: string;
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color,
  style,
}) => {
  const { typography, colors } = useTheme();

  const textStyle = StyleSheet.create({
    text: {
      ...typography[variant],
      color: color ?? colors.text.primary,
    },
  });

  return (
    <RNText style={[textStyle.text, style]}>
      {children}
    </RNText>
  );
}; 