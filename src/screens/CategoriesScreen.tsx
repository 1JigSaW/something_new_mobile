import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageHeader from '../ui/layout/PageHeader';
import EmptyState from '../ui/molecules/EmptyState';
import ErrorState from '../ui/molecules/ErrorState';
import { SwipeDeck } from '../ui/organisms/SwipeDeck';
import { useApp } from '../context/AppContext';
import { useRandomChallengesQuery } from '../features';
import { colors } from '../styles/colors';
import { Challenge } from '../types/challenge';

export default function CategoriesScreen() {
  const {
    setActiveChallenge,
    addToFavorites,
    canTakeNewChallenge,
    isPremium,
    completedToday,
    swipesUsedToday,
    maxSwipesPerDay,
    canSwipe,
    handleSwipe,
    markAsViewed,
    getUnviewedChallenges,
    markAsSelected,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { 
    data: challenges = [], 
    isLoading: loading, 
    error: queryError 
  } = useRandomChallengesQuery({
    limit: 20,
    freeOnly: !isPremium,
  });

  const categories = challenges.reduce((acc, challenge) => {
    const category = challenge.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  let filteredChallenges = challenges;
  
  if (selectedCategory) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.category === selectedCategory);
  }

  filteredChallenges = getUnviewedChallenges(filteredChallenges);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setActiveFilter(null);
  };

  const handleBackToFilters = () => {
    setActiveFilter(null);
  };

  const handleSwipeRight = (challenge: Challenge) => {
    if (!canSwipe()) {
      Alert.alert(
        'Swipe limit reached',
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today. Upgrade to Premium for unlimited swipes.`
      );
      return;
    }

    if (!canTakeNewChallenge()) {
      Alert.alert(
        'Limit Reached',
        isPremium ? 'Something went wrong' : 'You already completed a task today. Come back tomorrow!'
      );
      return;
    }

    markAsViewed(challenge.id);

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
          onPress: () => {
            setActiveChallenge(challenge);
            markAsSelected(challenge.id);
            handleSwipe();
          },
        },
      ]
    );
  };

  const handleSwipeLeft = (challenge: Challenge) => {
    if (!canSwipe()) {
      Alert.alert(
        'Swipe limit reached',
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today. Upgrade to Premium for unlimited swipes.`
      );
      return;
    }
    
    markAsViewed(challenge.id);
    handleSwipe();
  };

  const handleAddToFavorites = (challenge: Challenge) => {
    addToFavorites(challenge);
    Alert.alert('Added to Favorites', `"${challenge.title}" added to favorites`);
  };

  if (completedToday) {
    return (
      <View style={styles.container}>
        <PageHeader title="Categories" subtitle="Daily limit reached" />
        <EmptyState title="Great!" subtitle="You've completed your daily challenge. Come back tomorrow." />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <PageHeader title="Categories" subtitle="Loading" />
        <EmptyState title="Loading categories..." />
      </View>
    );
  }

  if (queryError) {
    return (
      <View style={styles.container}>
        <PageHeader title="Categories" subtitle="Error" />
        <ErrorState message="Failed to load categories" />
      </View>
    );
  }

  if (selectedCategory) {
    const categoryChallenges = categories[selectedCategory] || [];
    const unviewedCategoryChallenges = getUnviewedChallenges(categoryChallenges);

    if (unviewedCategoryChallenges.length === 0) {
      return (
        <View style={styles.container}>
          <PageHeader 
            title={selectedCategory} 
            subtitle="All viewed"
          />
          <EmptyState 
            title="All viewed!" 
            subtitle={`You've seen all ${selectedCategory} challenges. Try another category.`} 
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <PageHeader 
          title={selectedCategory} 
          subtitle={`${unviewedCategoryChallenges.length} challenges`}
        />
        
        <SwipeDeck
          challenges={unviewedCategoryChallenges}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onAddToFavorites={handleAddToFavorites}
        />
      </View>
    );
  }

  if (filteredChallenges.length === 0) {
    return (
      <View style={styles.container}>
        <PageHeader title="Categories" subtitle="All viewed" />
        <EmptyState 
          title="All viewed!" 
          subtitle="You've seen all available challenges. Come back tomorrow for new ones!" 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Categories" subtitle="Choose your challenge" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {Object.entries(categories).map(([category, categoryChallenges]) => {
            const unviewedCount = getUnviewedChallenges(categoryChallenges).length;
            const totalCount = categoryChallenges.length;
            
            if (unviewedCount === 0) return null;

            return (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryIcon}>
                  {category === 'health' ? '💪' : 
                   category === 'learning' ? '🧠' : 
                   category === 'productivity' ? '⚡' : 
                   category === 'social' ? '👥' : 
                   category === 'creative' ? '🎨' : 
                   category === 'mindfulness' ? '🧘' : '⭐'}
                </Text>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>
                  {unviewedCount}/{totalCount} left
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.randomButton} onPress={() => setActiveFilter('random')}>
          <Text style={styles.randomButtonText}>🎲 Random Challenge</Text>
        </TouchableOpacity>
      </ScrollView>

      {activeFilter === 'random' && (
        <View style={styles.swipeContainer}>
          <SwipeDeck
            challenges={filteredChallenges}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onAddToFavorites={handleAddToFavorites}
          />
          <TouchableOpacity style={styles.backButton} onPress={handleBackToFilters}>
            <Text style={styles.backButtonText}>← Back to Categories</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  randomButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  randomButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  swipeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});