import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon = '📊',
  color = colors.primary,
  trend = 'neutral',
  trendValue,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return colors.success;
      case 'down': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color + '20' }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <RNText style={styles.icon}>{icon}</RNText>
        </View>
        <RNText style={styles.title}>
          {title}
        </RNText>
        <RNText style={styles.value}>
          {value}
        </RNText>
        <RNText style={styles.subtitle}>
          {subtitle}
        </RNText>
      </View>

      {trend !== 'neutral' && trendValue && (
        <View style={styles.trendContainer}>
          <RNText style={[styles.trendIcon, { color: getTrendColor() }]}>
            {getTrendIcon()}
          </RNText>
          <RNText style={[styles.trendValue, { color: getTrendColor() }]}>
            {trendValue}
          </RNText>
        </View>
      )}
    </View>
  );
};

export default StatsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flex: 1,
    marginHorizontal: spacing.sm,
    ...shadows.md,
  },
  content: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    fontSize: typography.sm.fontSize,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  trendIcon: {
    fontSize: typography.sm.fontSize,
    marginRight: spacing.xs,
  },
  trendValue: {
    fontSize: typography.sm.fontSize,
    fontWeight: typography.weights.medium,
  },
});
