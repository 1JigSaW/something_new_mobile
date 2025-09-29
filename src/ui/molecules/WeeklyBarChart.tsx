import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles';

type WeeklyItem = { day: string; completed: number };

type WeeklyBarChartProps = {
  items: WeeklyItem[];
};

export default function WeeklyBarChart({ items }: WeeklyBarChartProps) {
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {items.map((item, index) => (
          <View key={index} style={styles.chartBar}>
            <View
              style={{
                width: 20,
                borderRadius: 4,
                marginBottom: 8,
                height: item.completed ? 60 : 20,
                backgroundColor: item.completed ? colors.success : colors.gray200,
              }}
            />
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.subtitle}>Daily completion rate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});


