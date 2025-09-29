import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles';

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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});


