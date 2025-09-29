import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles';

type CalendarDay = {
  day: string;
  completed: boolean;
  isCurrentMonth: boolean;
  isToday?: boolean;
};

type CalendarGridProps = {
  items: CalendarDay[];
};

export default function CalendarGrid({ items }: CalendarGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>{new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}</Text>
      </View>
      <View style={styles.grid}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Text key={i} style={styles.weekday}>{d}</Text>
        ))}
        {items.map((day, index) => (
          <View key={index} style={[styles.day, day.isToday && styles.today, day.completed && styles.completed, !day.isCurrentMonth && styles.otherMonth]}>
            <Text style={[styles.dayText, day.isToday && styles.todayText, day.completed && styles.completedText, !day.isCurrentMonth && styles.otherMonthText]}>
              {day.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: -20,
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    paddingVertical: 8,
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  today: {
    backgroundColor: colors.primary,
  },
  completed: {
    backgroundColor: colors.success,
  },
  otherMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  todayText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  completedText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: colors.textMuted,
  },
});


