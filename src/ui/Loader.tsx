import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Text from './atoms/Text';
import { colors, spacing } from '../styles';

interface LoaderProps {
  label?: string;
}

export default function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text color="muted" style={styles.label}>{label}</Text>
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
  label: {
    marginTop: spacing.sm,
  },
});


