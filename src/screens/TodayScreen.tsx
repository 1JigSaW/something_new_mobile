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
    resetTodayData,
    addToFavorites,
    swipesUsedToday,
    maxSwipesPerDay,
    canSwipe,
    useSwipe,
    markAsViewed,
    getUnviewedChallenges,
    markAsSelected,
    isSelected,
  } = useApp();

  // Load random cards for today
  const { 
    data: randomChallenges = [], 
    isLoading: loadingChallenges,
    error: challengesError 
  } = useRandomChallengesQuery({
    limit: 15,
    freeOnly: !isPremium,
  });

  // Swipe state - now managed globally
  

  // Check for new day on every focus
  useFocusEffect(
    React.useCallback(() => {
      const checkNewDay = async () => {
        const wasNewDay = await checkAndResetForNewDay();
        if (wasNewDay) {
          console.log('New day! State reset.');
        }
      };
      
      checkNewDay();
    }, [checkAndResetForNewDay])
  );

  // Reset swipe counter on new day - now handled globally


  const handleTakeNewChallenge = () => {
    if (!canTakeNewChallenge()) {
      Alert.alert(
        'Limit reached',
        isPremium ? 'Something went wrong' : 'You have already taken 5 challenges today. Come back tomorrow!'
      );
      return;
    }

    // Navigate to categories screen
    navigation.navigate('Categories' as never);
  };

  // Swipe handlers
  const handleSwipeRight = (challenge: any) => {
    if (!canSwipe()) {
      Alert.alert(
        'Swipe limit reached',
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today. Upgrade to Premium for unlimited swipes.`
      );
      return;
    }
    
    // Mark as selected and complete immediately
    markAsSelected(challenge.id);
    setActiveChallenge(challenge);
    completeChallenge();
    useSwipe();
  };

  const handleSwipeLeft = (challenge: any) => {
    if (!canSwipe()) {
      Alert.alert(
        'Swipe limit reached',
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today. Upgrade to Premium for unlimited swipes.`
      );
      return;
    }
    
    // Mark as viewed
    markAsViewed(challenge.id);
    
    console.log('Skipped card:', challenge.title);
    useSwipe();
  };

  const handleSwipe = () => {
    console.log('Swipe completed, counter:', swipesUsedToday + 1);
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
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subtitle}>Your progress</Text>
        </View>
        
        <View style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🎉</Text>
          <Text style={styles.completedTitle}>Great!</Text>
          <Text style={styles.completedText}>
            You've already completed your task today!
          </Text>
          <Text style={styles.streakText}>
            Streak: {streak} {streak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.subtitle}>Swipe to choose</Text>
          </View>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={async () => {
              console.log('🔥 HARD RESET STARTING...');
              Alert.alert(
                'Reset Today',
                'Reset all limits and data for today?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        console.log('🔥 HARD RESET - calling resetTodayData...');
                        await resetTodayData();
                        console.log('✅ HARD RESET COMPLETE!');
                        Alert.alert('SUCCESS!', 'ALL DATA CLEARED!');
                      } catch (error) {
                        console.error('HARD RESET ERROR:', error);
                        Alert.alert('Error', 'Hard reset failed: ' + (error instanceof Error ? error.message : String(error)));
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.deckContainer}>
        <SwipeDeck
          challenges={getUnviewedChallenges(randomChallenges)}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipe={handleSwipe}
          onAddToFavorites={(challenge) => {
            addToFavorites(challenge);
            Alert.alert('Added to Favorites', `"${challenge.title}" added to favorites`);
          }}
          disabled={!canSwipe()}
          swipeCount={swipesUsedToday}
          maxSwipes={maxSwipesPerDay}
          isPremium={isPremium}
          onUpgradePremium={() => {
            Alert.alert(
              'Premium',
              'Premium feature will be available in future versions!',
              [{ text: 'Got it' }]
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
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
