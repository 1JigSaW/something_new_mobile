import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../styles';

interface CardProps {
  style?: any;
}

export default function Card({
  children,
  style,
}: PropsWithChildren<CardProps>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});


