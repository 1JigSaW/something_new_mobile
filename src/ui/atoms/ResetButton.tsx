import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';

type ResetButtonProps = {
  title?: string,
  onPress: () => void,
  style?: ViewStyle,
};

export default function ResetButton({ title = 'Reset', onPress, style }: ResetButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.icon}>🔄</Text>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});


