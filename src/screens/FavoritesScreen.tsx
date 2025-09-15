import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

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
    isPremium,
    activeChallenge,
    setActiveChallenge,
    canTakeNewChallenge,
  } = useApp();

  const handleSelectChallenge = (challenge: Challenge) => {
    if (!canTakeNewChallenge()) {
      Alert.alert(
        'Лимит достигнут',
        isPremium ? 'Что-то пошло не так' : 'Вы уже выполнили задачу сегодня. Вернитесь завтра!'
      );
      return;
    }

    Alert.alert(
      'Выбрать эту идею?',
      `Вы уверены, что хотите выбрать "${challenge.title}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выбрать',
          onPress: () => setActiveChallenge(challenge),
        },
      ]
    );
  };

  const handleRemoveFromFavorites = (challenge: Challenge) => {
    Alert.alert(
      'Удалить из избранного?',
      `Вы уверены, что хотите удалить "${challenge.title}" из избранного?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
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
          <Text style={styles.title}>Избранное</Text>
          <Text style={styles.subtitle}>Сохраненные идеи</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Пока нет избранных идей</Text>
          <Text style={styles.emptyText}>
            Добавляйте понравившиеся идеи в избранное, чтобы вернуться к ним позже
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Избранное</Text>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? 'идея' : 'идей'}
          {!isPremium && ` (лимит: 10)`}
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
                style={[styles.selectButton, !canTakeNewChallenge() && styles.selectButtonDisabled]}
                onPress={() => handleSelectChallenge(challenge)}
                disabled={!canTakeNewChallenge()}
              >
                <Text style={[styles.selectButtonText, !canTakeNewChallenge() && styles.selectButtonTextDisabled]}>
                  Выбрать
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveFromFavorites(challenge)}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {!isPremium && favorites.length >= 10 && (
          <View style={styles.limitWarning}>
            <Text style={styles.limitWarningText}>
              🚫 Достигнут лимит избранного (10 идей)
            </Text>
            <Text style={styles.limitWarningSubtext}>
              Обновитесь до Premium для безлимитного сохранения
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeContent: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeTime: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginRight: 8,
  },
  challengeCategory: {
    fontSize: 12,
    color: '#999',
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  challengeActions: {
    alignItems: 'center',
    gap: 8,
  },
  selectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: '#ccc',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  selectButtonTextDisabled: {
    color: '#999',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
  },
  limitWarning: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  limitWarningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
    textAlign: 'center',
  },
  limitWarningSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
});