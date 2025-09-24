import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../styles/colors';

interface Challenge {
  id: number;
  title: string;
  short_description: string;
  category: string;
  tags: string;
  size: 'small' | 'medium' | 'large';
  estimated_duration_min: number;
  is_premium_only: boolean;
  created_at: string;
  updated_at: string;
}

export default function FavoritesScreen() {
  const {
    favorites,
    removeFromFavorites,
    addToFavorites,
    activeChallenge,
    setActiveChallenge,
  } = useApp();

  const handleSelectChallenge = (challenge: Challenge) => {
    Alert.alert(
      'Select this idea?',
      `Are you sure you want to select "${challenge.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Select',
          onPress: () => setActiveChallenge(challenge),
        },
      ]
    );
  };

  const handleRemoveFromFavorites = (challenge: Challenge) => {
    Alert.alert(
      'Remove from Favorites?',
      `Are you sure you want to remove "${challenge.title}" from favorites?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeFromFavorites(challenge.id),
        },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>Saved ideas</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Add ideas you like to favorites to return to them later
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? 'idea' : 'ideas'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {favorites.map((challenge) => (
          <View key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>{challenge.short_description}</Text>
              
              <View style={styles.challengeMeta}>
                <Text style={styles.challengeTime}>
                  ⏱️ {challenge.estimated_duration_min ? 
                    `${challenge.estimated_duration_min}m` : 
                    challenge.size === 'small' ? '5-30m' : 
                    challenge.size === 'medium' ? '30-90m' : '2h+'}
                </Text>
                <Text style={styles.challengeCategory}>• {challenge.category}</Text>
              </View>

              {challenge.is_premium_only && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              )}
            </View>

            <View style={styles.challengeActions}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectChallenge(challenge)}
                activeOpacity={0.7}
              >
                <Text style={styles.selectButtonText}>
                  Select
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveFromFavorites(challenge)}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 0,
  },
  selectButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 0,
  },
  removeButtonText: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});