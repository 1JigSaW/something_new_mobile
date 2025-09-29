import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Challenge } from '../../types/challenge';
import { colors } from '../../styles/colors';

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect?: (challenge: Challenge) => void;
  onAddToFavorites?: (challenge: Challenge) => void;
  onRemoveFromFavorites?: (challengeId: number) => void;
  showActions?: boolean;
  variant?: 'default' | 'favorite';
}

export function ChallengeCard({
  challenge,
  onSelect,
  onAddToFavorites,
  onRemoveFromFavorites,
  showActions = true,
  variant = 'default'
}: ChallengeCardProps) {
  const getDurationText = () => {
    if (challenge.estimated_duration_min) {
      return `${challenge.estimated_duration_min}m`;
    }
    switch (challenge.size) {
      case 'small': return '5-30m';
      case 'medium': return '30-90m';
      case 'large': return '2h+';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeContent}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.short_description}</Text>
        
        <View style={styles.challengeMeta}>
          <Text style={styles.challengeTime}>
            ⏱️ {getDurationText()}
          </Text>
          <Text style={styles.challengeCategory}>• {challenge.category}</Text>
        </View>

        {challenge.is_premium_only && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
      </View>

      {showActions && (
        <View style={styles.challengeActions}>
          {onSelect && (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => onSelect(challenge)}
              activeOpacity={0.7}
            >
              <Text style={styles.selectButtonText}>
                Select
              </Text>
            </TouchableOpacity>
          )}
          
          {variant === 'favorite' && onRemoveFromFavorites ? (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => onRemoveFromFavorites(challenge.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.removeButtonText}>Delete</Text>
            </TouchableOpacity>
          ) : onAddToFavorites ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => onAddToFavorites(challenge)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}

// Стили вынесены в отдельный файл для упрощения
const styles = StyleSheet.create({
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeContent: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
    lineHeight: 26,
  },
  challengeDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeTime: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  challengeCategory: {
    fontSize: 12,
    color: colors.textMuted,
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  challengeActions: {
    alignItems: 'center',
    gap: 8,
  },
  selectButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  selectButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  removeButtonText: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: '600',
  },
});