import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <RNText style={styles.icon}>{icon}</RNText>
        </View>
        <View style={styles.textContainer}>
          <RNText style={styles.title}>
            {title}
          </RNText>
          <RNText style={styles.subtitle}>
            {subtitle}
          </RNText>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressWidth}%`, backgroundColor: color }]} />
      </View>

      <View style={styles.footer}>
        <RNText style={styles.progressText}>
          {progressWidth}% complete
        </RNText>
        <RNText style={[styles.progressPercent, { color }]}>
          {Math.round(progressWidth)}%
        </RNText>
      </View>
    </View>
  );
};

export default ProgressCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.lg.fontSize,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sm.fontSize,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.sm.fontSize,
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: typography.sm.fontSize,
    fontWeight: typography.weights.semibold,
  },
});
