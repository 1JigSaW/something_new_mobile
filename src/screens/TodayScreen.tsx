import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageHeader from '../ui/layout/PageHeader';
import Section from '../ui/layout/Section';
import EmptyState from '../ui/molecules/EmptyState';
import ErrorState from '../ui/molecules/ErrorState';
import ResetButton from '../ui/atoms/ResetButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { useRandomChallengesQuery, Challenge } from '../features/challenges/useRandomChallengesQuery';
import { SwipeDeck } from '../components/SwipeDeck';
import { colors } from '../styles/colors';

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

  const { 
    data: randomChallenges = [], 
    isLoading: loadingChallenges,
    error: challengesError 
  } = useRandomChallengesQuery({
    limit: 15,
    freeOnly: !isPremium,
  });

  
  
  
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

  const handleTakeNewChallenge = () => {
    if (!canTakeNewChallenge()) {
      Alert.alert(
        'Limit reached',
        isPremium ? 'Something went wrong' : 'You have already taken 5 challenges today. Come back tomorrow!'
      );
      return;
    }

    navigation.navigate('Categories' as never);
  };

  const handleSwipeRight = (challenge: any) => {
    if (!canSwipe()) {
      Alert.alert(
        'Swipe limit reached',
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today. Upgrade to Premium for unlimited swipes.`
      );
      return;
    }
    
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
        <PageHeader title="Today" subtitle="Loading your challenge..." />
        <EmptyState title="Loading cards..." />
      </View>
    );
  }

  if (challengesError) {
    return (
      <View style={styles.container}>
        <PageHeader title="Today" subtitle="Loading error" />
        <ErrorState message={`Error loading cards: ${challengesError instanceof Error ? challengesError.message : 'Unknown error'}`} />
      </View>
    );
  }

  if (completedToday) {
    return (
      <View style={styles.container}>
        <PageHeader title="Today" subtitle="Your progress" />
        
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
      <PageHeader
        title="Today"
        subtitle="Swipe to choose"
        right={(
          <ResetButton onPress={async () => {
            Alert.alert(
              'Reset Today',
              'Reset all limits and data for today?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: async () => {
                  try {
                    await resetTodayData();
                    Alert.alert('SUCCESS!', 'ALL DATA CLEARED!');
                  } catch (error) {
                    Alert.alert('Error', 'Hard reset failed: ' + (error instanceof Error ? error.message : String(error)));
                  }
                }}
              ]
            );
          }} />
        )}
      />

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
          onReset={async () => {
            console.log('🔥 RESET FROM SWIPEDECK...');
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
                      console.log('🔥 RESET - calling resetTodayData...');
                      await resetTodayData();
                      console.log('✅ RESET COMPLETE!');
                      Alert.alert('SUCCESS!', 'ALL DATA CLEARED!');
                    } catch (error) {
                      console.error('RESET ERROR:', error);
                      Alert.alert('Error', 'Reset failed: ' + (error instanceof Error ? error.message : String(error)));
                    }
                  }
                }
              ]
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
    backgroundColor: colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
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
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  newChallengeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  newChallengeButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  
  deckContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  resetButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resetIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
