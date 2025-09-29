import React, { PropsWithChildren } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors, typography } from '../../styles';

interface TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  color?: 'default' | 'muted' | 'success' | 'warning' | 'error';
  style?: any;
}

export default function Text({
  children,
  variant = 'body',
  color = 'default',
  style,
}: PropsWithChildren<TextProps>) {
  const getTextStyle = () => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      default:
        return styles.body;
    }
  };

  const getColorStyle = () => {
    switch (color) {
      case 'default':
        return styles.defaultColor;
      case 'muted':
        return styles.mutedColor;
      case 'success':
        return styles.successColor;
      case 'warning':
        return styles.warningColor;
      case 'error':
        return styles.errorColor;
      default:
        return styles.defaultColor;
    }
  };

  return <RNText style={[getTextStyle(), getColorStyle(), style]}>{children}</RNText>;
}

const styles = StyleSheet.create({
  title: typography.title,
  subtitle: typography.subtitle,
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  caption: typography.caption,
  defaultColor: {
    color: colors.textPrimary,
  },
  mutedColor: {
    color: colors.textSecondary,
  },
  successColor: {
    color: colors.success,
  },
  warningColor: {
    color: colors.warning,
  },
  errorColor: {
    color: colors.error,
  },
});


