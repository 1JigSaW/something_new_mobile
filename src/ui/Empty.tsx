import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './atoms/Text';
import { spacing } from '../styles';

interface EmptyProps {
  title?: string;
  subtitle?: string;
}

export default function Empty({
  title = 'Nothing here yet',
  subtitle = 'Try adjusting filters or come back later.',
}: EmptyProps) {
  return (
    <View style={styles.container}>
      <Text variant="subtitle">{title}</Text>
      <Text color="muted" style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});


