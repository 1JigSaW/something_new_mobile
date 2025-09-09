import React from 'react';
import { Pressable, Text } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../styles';

type ButtonProps = {
  title: string,
  onPress: () => void,
  variant?: 'primary' | 'secondary' | 'ghost',
  disabled?: boolean,
  style?: any,
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.sm,
      alignItems: 'center' as const,
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: colors.primary };
      case 'secondary':
        return { ...baseStyle, backgroundColor: colors.surfaceSecondary };
      case 'ghost':
        return { ...baseStyle, backgroundColor: 'transparent' };
      default:
        return { ...baseStyle, backgroundColor: colors.primary };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...typography.button,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, color: 'white' };
      case 'secondary':
        return { ...baseStyle, color: colors.textPrimary };
      case 'ghost':
        return { ...baseStyle, color: colors.primary };
      default:
        return { ...baseStyle, color: 'white' };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => ({ 
        ...getButtonStyle(), 
        ...style,
        opacity: pressed ? 0.9 : getButtonStyle().opacity 
      })}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </Pressable>
  );
}


