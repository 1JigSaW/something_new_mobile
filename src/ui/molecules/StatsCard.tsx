import React from 'react';
import { View, Text as RNText } from 'react-native';
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
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        flex: 1,
        marginHorizontal: spacing.sm,
        ...shadows.md,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: spacing.sm }}>
        <View style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 16, 
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.sm,
        }}>
          <RNText style={{ fontSize: 16 }}>{icon}</RNText>
        </View>
        <RNText style={{ 
          fontSize: typography.sm.fontSize, 
          color: colors.textSecondary,
          marginBottom: 4,
        }}>
          {title}
        </RNText>
        <RNText style={{ 
          fontSize: 24, 
          fontWeight: typography.weights.bold,
          color: colors.textPrimary,
          marginBottom: 2,
        }}>
          {value}
        </RNText>
        <RNText style={{ 
          fontSize: 12, 
          color: colors.textSecondary,
        }}>
          {subtitle}
        </RNText>
      </View>

      {trend !== 'neutral' && trendValue && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          marginTop: spacing.sm,
        }}>
          <RNText style={{ 
            fontSize: typography.sm.fontSize, 
            color: getTrendColor(),
            marginRight: spacing.xs,
          }}>
            {getTrendIcon()}
          </RNText>
          <RNText style={{ 
            fontSize: typography.sm.fontSize, 
            color: getTrendColor(),
            fontWeight: typography.weights.medium,
          }}>
            {trendValue}
          </RNText>
        </View>
      )}
    </View>
  );
};

export default StatsCard;
