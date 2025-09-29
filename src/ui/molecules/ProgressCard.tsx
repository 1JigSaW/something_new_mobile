import React from 'react';
import { View, Text as RNText } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles';

interface ProgressCardProps {
  title: string;
  subtitle: string;
  progress: number;
  color?: string;
  icon?: string;
  onPress?: () => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  subtitle,
  progress,
  color = colors.primary,
  icon = '📚',
}) => {
  const progressWidth = Math.max(0, Math.min(100, progress));

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        ...shadows.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <View style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}>
          <RNText style={{ fontSize: 20 }}>{icon}</RNText>
        </View>
        <View style={{ flex: 1 }}>
          <RNText style={{ 
            fontSize: typography.lg.fontSize, 
            fontWeight: typography.weights.semibold,
            color: colors.textPrimary,
            marginBottom: 4,
          }}>
            {title}
          </RNText>
          <RNText style={{ 
            fontSize: typography.sm.fontSize, 
            color: colors.textSecondary,
          }}>
            {subtitle}
          </RNText>
        </View>
      </View>

      <View style={{ 
        height: 8, 
        backgroundColor: colors.surfaceSecondary, 
        borderRadius: 4,
        marginBottom: spacing.sm,
      }}>
        <View style={{
          height: '100%',
          width: `${progressWidth}%`,
          backgroundColor: color,
          borderRadius: 4,
        }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <RNText style={{ 
          fontSize: typography.sm.fontSize, 
          color: colors.textSecondary,
        }}>
          {progressWidth}% complete
        </RNText>
        <RNText style={{ 
          fontSize: typography.sm.fontSize, 
          color: color,
          fontWeight: typography.weights.semibold,
        }}>
          {Math.round(progressWidth)}%
        </RNText>
      </View>
    </View>
  );
};

export default ProgressCard;
