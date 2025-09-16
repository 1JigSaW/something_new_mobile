import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { useRandomChallengesQuery, Challenge } from '../features/challenges/useRandomChallengesQuery';
import { SwipeDeck } from '../components/SwipeDeck';

export default function TodayScreen() {
  const navigation = useNavigation();
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
    resetToNewDay,
    checkAndResetForNewDay,
    addToFavorites,
  } = useApp();

  // Загружаем случайные карточки для сегодня
  const { 
    data: randomChallenges = [], 
    isLoading: loadingChallenges,
    error: challengesError 
  } = useRandomChallengesQuery({
    limit: 15,
    freeOnly: !isPremium,
  });

  // Состояние для свайпов
  const [swipeCount, setSwipeCount] = useState(0);
  const maxSwipes = isPremium ? 999 : 5;
  
  // Состояние для выбранной карточки
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Проверяем новый день при каждом фокусе на экране
  useFocusEffect(
    React.useCallback(() => {
      const checkNewDay = async () => {
        const wasNewDay = await checkAndResetForNewDay();
        if (wasNewDay) {
          console.log('Новый день! Состояние сброшено.');
        }
      };
      
      checkNewDay();
    }, [checkAndResetForNewDay])
  );

  // Сбрасываем счетчик свайпов при новом дне
  useEffect(() => {
    if (!completedToday) {
      setSwipeCount(0);
    }
  }, [completedToday]);

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
        isPremium ? 'Что-то пошло не так' : 'Вы уже взяли 5 челленджей сегодня. Вернитесь завтра!'
      );
      return;
    }

    // Переходим на экран категорий
    navigation.navigate('Categories' as never);
  };

  // Обработчики для свайпов
  const handleSwipeRight = (challenge: any) => {
    console.log('Выбрана карточка:', challenge.title);
    setSelectedChallenge(challenge);
    setActiveChallenge(challenge);
    setSwipeCount(prev => prev + 1);
  };

  const handleSwipeLeft = (challenge: any) => {
    console.log('Пропущена карточка:', challenge.title);
    setSwipeCount(prev => prev + 1);
  };

  const handleSwipe = () => {
    console.log('Свайп выполнен, счетчик:', swipeCount + 1);
  };

  if (loadingChallenges) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subtitle}>Loading your challenge...</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cards...</Text>
        </View>
      </View>
    );
  }

  if (challengesError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subtitle}>Loading error</Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading cards: {challengesError instanceof Error ? challengesError.message : 'Unknown error'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              // Reload app
              console.log('Reloading app...');
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

  if (selectedChallenge) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Сегодня</Text>
          <Text style={styles.subtitle}>Ваш вызов</Text>
        </View>
        
        <View style={styles.selectedChallengeContainer}>
          <View style={styles.selectedChallengeCard}>
            <Text style={styles.selectedChallengeTitle}>{selectedChallenge.title}</Text>
            <Text style={styles.selectedChallengeDescription}>
              {selectedChallenge.short_description}
            </Text>
            
            <View style={styles.selectedChallengeMeta}>
              <Text style={styles.selectedChallengeTime}>
                ⏱️ {selectedChallenge.estimated_duration_min ? 
                  `${selectedChallenge.estimated_duration_min}m` : 
                  selectedChallenge.size === 'small' ? '5-30m' : 
                  selectedChallenge.size === 'medium' ? '30-90m' : '2h+'}
              </Text>
              <Text style={styles.selectedChallengeCategory}>• {selectedChallenge.category}</Text>
            </View>

            {selectedChallenge.is_premium_only && (
              <View style={styles.selectedPremiumBadge}>
                <Text style={styles.selectedPremiumText}>PREMIUM</Text>
              </View>
            )}
          </View>

          <View style={styles.selectedActionsContainer}>
            <TouchableOpacity 
              style={styles.selectedCompleteButton}
              onPress={handleComplete}
            >
              <Text style={styles.selectedCompleteButtonText}>✅ Завершить</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backToSwipeButton}
            onPress={() => setSelectedChallenge(null)}
          >
            <Text style={styles.backToSwipeButtonText}>← Выбрать другую карточку</Text>
          </TouchableOpacity>
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
        <Text style={styles.subtitle}>Свайпайте для выбора</Text>
      </View>

      <View style={styles.deckContainer}>
        <SwipeDeck
          challenges={randomChallenges}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipe={handleSwipe}
          disabled={swipeCount >= maxSwipes}
          swipeCount={swipeCount}
          maxSwipes={maxSwipes}
          isPremium={isPremium}
          onUpgradePremium={() => {
            Alert.alert(
              'Premium',
              'Функция Premium будет доступна в следующих версиях!',
              [{ text: 'Понятно' }]
            );
          }}
        />
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
    paddingBottom: 15,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deckContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  selectedChallengeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  selectedChallengeCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  selectedChallengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedChallengeDescription: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  selectedChallengeMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedChallengeTime: {
    fontSize: 14,
    color: 'white',
    marginRight: 12,
  },
  selectedChallengeCategory: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  selectedPremiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedPremiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  selectedActionsContainer: {
    marginBottom: 20,
  },
  selectedCompleteButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedCompleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backToSwipeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backToSwipeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
