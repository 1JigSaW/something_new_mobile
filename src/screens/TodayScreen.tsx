import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export default function TodayScreen() {
  const {
    activeChallenge,
    setActiveChallenge,
    completeChallenge,
    skipChallenge,
    canSkip,
    canTakeNewChallenge,
    streak,
    completedToday,
    isPremium,
  } = useApp();

  const handleComplete = () => {
    Alert.alert(
      'Поздравляем! 🎉',
      'Вы завершили вызов! Отличная работа!',
      [
        {
          text: 'Отлично!',
          onPress: completeChallenge,
        },
      ]
    );
  };

  const handleSkip = () => {
    if (!canSkip()) {
      Alert.alert(
        'Лимит пропусков',
        isPremium ? 'Что-то пошло не так' : 'Вы использовали все пропуски на сегодня'
      );
      return;
    }

    Alert.alert(
      'Пропустить вызов?',
      'Вы уверены, что хотите пропустить этот вызов?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Пропустить',
          onPress: skipChallenge,
        },
      ]
    );
  };

  const handleTakeNewChallenge = () => {
    if (!canTakeNewChallenge()) {
      Alert.alert(
        'Лимит достигнут',
        isPremium ? 'Что-то пошло не так' : 'Вы уже выполнили задачу сегодня. Вернитесь завтра!'
      );
      return;
    }

    // Здесь можно добавить логику выбора нового вызова
    Alert.alert('Новый вызов', 'Выберите категорию в разделе "Категории"');
  };

  if (completedToday) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Сегодня</Text>
          <Text style={styles.subtitle}>Ваш прогресс</Text>
        </View>
        
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedTitle}>Отлично!</Text>
          <Text style={styles.completedText}>
            Вы уже выполнили задачу сегодня!
          </Text>
          <Text style={styles.streakText}>
            Серия: {streak} {streak === 1 ? 'день' : 'дней'}
          </Text>
        </View>
      </View>
    );
  }

  if (activeChallenge) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Сегодня</Text>
          <Text style={styles.subtitle}>Ваш вызов</Text>
        </View>
        
        <View style={styles.challengeContainer}>
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>{activeChallenge.title}</Text>
            <Text style={styles.challengeDescription}>
              {activeChallenge.short_description}
            </Text>
            
            <View style={styles.challengeMeta}>
              <Text style={styles.challengeTime}>
                ⏱️ {activeChallenge.estimated_duration_min ? 
                  `${activeChallenge.estimated_duration_min}m` : 
                  activeChallenge.size === 'small' ? '5-30m' : 
                  activeChallenge.size === 'medium' ? '30-90m' : '2h+'}
              </Text>
              <Text style={styles.challengeCategory}>• {activeChallenge.category}</Text>
            </View>

            {activeChallenge.is_premium_only && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>✅ Завершить</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.skipButton, !canSkip() && styles.skipButtonDisabled]}
              onPress={handleSkip}
              disabled={!canSkip()}
            >
              <Text style={[styles.skipButtonText, !canSkip() && styles.skipButtonTextDisabled]}>
                ⏭️ Пропустить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Сегодня</Text>
        <Text style={styles.subtitle}>Ваш вызов</Text>
      </View>
      
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🎯</Text>
        <Text style={styles.emptyTitle}>Нет активного вызова</Text>
        <Text style={styles.emptyText}>
          Выберите категорию или возьмите новый вызов
        </Text>
        
        <TouchableOpacity 
          style={styles.newChallengeButton}
          onPress={handleTakeNewChallenge}
        >
          <Text style={styles.newChallengeButtonText}>Взять новый вызов</Text>
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completedEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  challengeContainer: {
    flex: 1,
    padding: 20,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  challengeDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeTime: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginRight: 12,
  },
  challengeCategory: {
    fontSize: 14,
    color: '#999',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonDisabled: {
    backgroundColor: '#ccc',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButtonTextDisabled: {
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
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
    marginBottom: 32,
  },
  newChallengeButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  newChallengeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
