import React from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import Text from './Text';
import { colors, spacing, borderRadius } from '../../styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: any;
}

export default function Input({
  label,
  error,
  style,
  ...rest
}: InputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error ? (
        <Text color="error" style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  error: {
    marginTop: spacing.xs,
  },
});


