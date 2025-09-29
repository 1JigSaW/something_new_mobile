import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { colors, spacing, borderRadius } from '../../styles';

interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  return (
    <View style={styles.container}>
      <Text variant="caption" color="muted">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
  },
});


