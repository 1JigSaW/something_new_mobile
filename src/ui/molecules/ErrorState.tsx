import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles';

type ErrorStateProps = {
  message: string,
  style?: ViewStyle,
};

export default function ErrorState({ message, style }: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});


