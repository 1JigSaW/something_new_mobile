import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';

interface FilterOption {
  key: string;
  label: string;
  icon: string;
  color: string;
  duration?: string;
}

interface FilterSectionProps {
  title: string;
  filters: FilterOption[];
  onFilterSelect: (filterKey: string) => void;
  activeFilter?: string | null;
}

export function FilterSection({ 
  title, 
  filters, 
  onFilterSelect, 
  activeFilter 
}: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.categoryCard, 
              { backgroundColor: filter.color + '15' },
              activeFilter === filter.key && styles.activeCard
            ]}
            onPress={() => onFilterSelect(filter.key)}
          >
            <View style={styles.categoryCardContent}>
              <Text style={[styles.categoryIcon, { color: filter.color }]}>
                {filter.icon}
              </Text>
              <Text style={styles.categoryCardTitle}>{filter.label}</Text>
              {filter.duration && (
                <Text style={styles.categoryCardDuration}>{filter.duration}</Text>
              )}
            </View>
            <Text style={styles.categoryCardArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  horizontalContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  categoryCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  activeCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  categoryCardContent: {
    flex: 1,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  categoryCardDuration: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryCardArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
