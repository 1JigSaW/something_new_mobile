import React from 'react';
import { View, Text as RNText } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  color?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  isUnlocked,
  progress = 0,
  maxProgress = 100,
  color = colors.primary,
}) => {
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <View
      style={{
        backgroundColor: isUnlocked ? colors.surface : colors.surfaceSecondary,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        opacity: isUnlocked ? 1 : 0.6,
        ...shadows.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <View style={{ 
          width: 50, 
          height: 50, 
          borderRadius: 25, 
          backgroundColor: isUnlocked ? color : colors.gray300,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}>
          <RNText style={{ fontSize: 24 }}>{icon}</RNText>
        </View>
        <View style={{ flex: 1 }}>
          <RNText style={{ 
            fontSize: typography.lg.fontSize, 
            fontWeight: typography.weights.semibold,
            color: isUnlocked ? colors.textPrimary : colors.textSecondary,
            marginBottom: 4,
          }}>
            {title}
          </RNText>
          <RNText style={{ 
            fontSize: typography.sm.fontSize, 
            color: colors.textSecondary,
          }}>
            {description}
          </RNText>
        </View>
        {isUnlocked && (
          <View style={{ 
            width: 24, 
            height: 24, 
            borderRadius: 12, 
            backgroundColor: colors.success,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <RNText style={{ fontSize: 16, color: 'white' }}>✓</RNText>
          </View>
        )}
      </View>

      {!isUnlocked && maxProgress > 0 && (
        <View>
          <View style={{ 
            height: 6, 
            backgroundColor: colors.gray200, 
            borderRadius: 3,
            marginBottom: spacing.sm,
          }}>
            <View style={{
              height: '100%',
              width: `${Math.min(100, progressPercentage)}%`,
              backgroundColor: color,
              borderRadius: 3,
            }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <RNText style={{ 
              fontSize: typography.sm.fontSize, 
              color: colors.textSecondary,
            }}>
              Progress
            </RNText>
            <RNText style={{ 
              fontSize: typography.sm.fontSize, 
              color: colors.textSecondary,
            }}>
              {progress} / {maxProgress}
            </RNText>
          </View>
        </View>
      )}
    </View>
  );
};

export default AchievementCard;
