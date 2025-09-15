import React, { PropsWithChildren } from 'react';
import { Text as RNText } from 'react-native';
import { colors, typography } from '../../styles';

type TextProps = {
  variant?: 'title' | 'subtitle' | 'body' | 'caption',
  color?: 'default' | 'muted' | 'success' | 'warning' | 'error',
  className?: string,
};

export default function Text({
  children,
  variant = 'body',
  color = 'default',
  className = '',
}: PropsWithChildren<TextProps>) {
  const getTextStyle = () => {
    switch (variant) {
      case 'title':
        return typography.title;
      case 'subtitle':
        return typography.subtitle;
      case 'body':
        return { fontSize: 16, lineHeight: 24, fontWeight: '400' as const };
      case 'caption':
        return typography.caption;
      default:
        return { fontSize: 16, lineHeight: 24, fontWeight: '400' as const };
    }
  };

  const getColorStyle = () => {
    switch (color) {
      case 'default':
        return { color: colors.textPrimary };
      case 'muted':
        return { color: colors.textSecondary };
      case 'success':
        return { color: colors.success };
      case 'warning':
        return { color: colors.warning };
      case 'error':
        return { color: colors.error };
      default:
        return { color: colors.textPrimary };
    }
  };

  return <RNText style={{ ...getTextStyle(), ...getColorStyle() }}>{children}</RNText>;
}


