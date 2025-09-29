import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles';

type SwipeHintsProps = {
  leftLabel: string,
  rightLabel: string,
  style?: ViewStyle,
};

export default function SwipeHints({ leftLabel, rightLabel, style }: SwipeHintsProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}> 
        <Text style={styles.arrow}>←</Text>
        <Text style={styles.label}>{leftLabel}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.label}>{rightLabel}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.9,
    marginHorizontal: 4,
  },
  label: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.85,
  },
});


