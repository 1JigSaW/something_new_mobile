import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import PageHeader from '../ui/layout/PageHeader';
import EmptyState from '../ui/molecules/EmptyState';
import ErrorState from '../ui/molecules/ErrorState';
import { SwipeDeck } from '../ui/organisms/SwipeDeck';
import { useApp } from '../context/AppContext';
import { useRandomChallengesQuery } from '../features';
import { colors } from '../styles/colors';

const { width: screenWidth } = Dimensions.get('window');

import { Challenge } from '../types/challenge';

export default function CategoriesScreen() {
  const {
    activeChallenge,
    setActiveChallenge,
    addToFavorites,
    canTakeNewChallenge,
    isPremium,
    completedToday,
    swipesUsedToday,
    maxSwipesPerDay,
    canSwipe,
    useSwipe,
    markAsViewed,
    getUnviewedChallenges,
    markAsSelected,
    isSelected,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
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
  
  if (selectedSize) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.size === selectedSize);
  }
  
  if (selectedDuration) {
    filteredChallenges = filteredChallenges.filter(challenge => {
      const duration = challenge.estimated_duration_min || 
        (challenge.size === 'small' ? 15 : challenge.size === 'medium' ? 60 : 120);
      
      switch (selectedDuration) {
        case 'quick': return duration <= 30;
        case 'medium': return duration > 30 && duration <= 90;
        case 'long': return duration > 90;
        default: return true;
      }
    });
  }
  
  if (showPremiumOnly) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.is_premium_only);
  }

  filteredChallenges = getUnviewedChallenges(filteredChallenges);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setActiveFilter(null);
  };

  const handleSizeSelect = (size: string | null) => {
    setSelectedSize(size);
    setActiveFilter(size ? `size-${size}` : null);
    setSelectedCategory(null);
  };

  const handleDurationSelect = (duration: string | null) => {
    setSelectedDuration(duration);
    setActiveFilter(duration ? `duration-${duration}` : null);
    setSelectedCategory(null);
  };

  const handlePremiumSelect = () => {
    setShowPremiumOnly(!showPremiumOnly);
    setActiveFilter(!showPremiumOnly ? 'premium' : null);
    setSelectedCategory(null);
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
            useSwipe();
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
    console.log('Skipped challenge:', challenge.title);
    useSwipe();
  };

  const handleAddToFavorites = (challenge: Challenge) => {
    addToFavorites(challenge);
    Alert.alert('Added to Favorites', `"${challenge.title}" added to favorites`);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setActiveFilter(null);
  };

  const handleBackToFilters = () => {
    setActiveFilter(null);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedDuration(null);
    setShowPremiumOnly(false);
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
        <ErrorState 
          message={queryError instanceof Error ? queryError.message : 'Unknown error'}
        />
      </View>
    );
  }

  if (selectedCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToCategories} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedCategory}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.deckContainer}>
             <SwipeDeck
               challenges={filteredChallenges}
               onSwipeRight={handleSwipeRight}
               onSwipeLeft={handleSwipeLeft}
               onAddToFavorites={handleAddToFavorites}
               disabled={!canSwipe()}
               swipeCount={swipesUsedToday}
               maxSwipes={maxSwipesPerDay}
               isPremium={isPremium}
               isSelected={isSelected}
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

  if (activeFilter) {
    const filterTitle = activeFilter === 'premium' ? 'Premium' : 
                       activeFilter.startsWith('size-') ? `Size: ${activeFilter.split('-')[1]}` :
                       activeFilter.startsWith('duration-') ? `Duration: ${activeFilter.split('-')[1]}` : 'Filter';
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToFilters} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{filterTitle}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.deckContainer}>
             <SwipeDeck
               challenges={filteredChallenges}
               onSwipeRight={handleSwipeRight}
               onSwipeLeft={handleSwipeLeft}
               onAddToFavorites={handleAddToFavorites}
               disabled={!canSwipe()}
               swipeCount={swipesUsedToday}
               maxSwipes={maxSwipesPerDay}
               isPremium={isPremium}
               isSelected={isSelected}
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

  return (
    <View style={styles.container}>
      <PageHeader title="Explore" subtitle="Discover amazing ideas" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>📦 Size</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            {[
              { key: 'small', label: 'Small', icon: '●', color: colors.categorySmall },
              { key: 'medium', label: 'Medium', icon: '●', color: colors.categoryMedium },
              { key: 'large', label: 'Large', icon: '●', color: colors.categoryLarge },
            ].map((size) => (
              <TouchableOpacity
                key={size.key}
                style={[styles.categoryCard, { backgroundColor: colors.categorySmall && size.key === 'small' ? colors.categorySmall + '15' : size.key === 'medium' ? colors.categoryMedium + '15' : colors.categoryLarge + '15' }]}
                onPress={() => handleSizeSelect(size.key)}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={[styles.categoryIcon, { color: size.key === 'small' ? colors.categorySmall : size.key === 'medium' ? colors.categoryMedium : colors.categoryLarge }]}>{size.icon}</Text>
                  <Text style={styles.categoryCardTitle}>{size.label}</Text>
                  <Text style={styles.categoryCardCount}>
                    {challenges.filter(c => c.size === size.key).length} ideas
                  </Text>
                </View>
                <Text style={styles.categoryCardArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Duration</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            {[
              { key: 'quick', label: 'Quick', icon: '⚡', color: colors.categoryQuick, duration: '≤30m' },
              { key: 'medium', label: 'Medium', icon: '⏱', color: colors.categoryMedium, duration: '30-90m' },
              { key: 'long', label: 'Long', icon: '🕐', color: colors.categoryLong, duration: '90m+' },
            ].map((duration) => (
              <TouchableOpacity
                key={duration.key}
                style={[styles.categoryCard, { backgroundColor: duration.color + '15' }]}
                onPress={() => handleDurationSelect(duration.key)}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={[styles.categoryIcon, { color: duration.color }]}>{duration.icon}</Text>
                  <Text style={styles.categoryCardTitle}>{duration.label}</Text>
                  <Text style={styles.categoryCardDuration}>{duration.duration}</Text>
                  <Text style={styles.categoryCardCount}>
                    {challenges.filter(c => {
                      const d = c.estimated_duration_min || (c.size === 'small' ? 15 : c.size === 'medium' ? 60 : 120);
                      return duration.key === 'quick' ? d <= 30 : duration.key === 'medium' ? d > 30 && d <= 90 : d > 90;
                    }).length} ideas
                  </Text>
                </View>
                <Text style={styles.categoryCardArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isPremium && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Premium</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalContent}
            >
              <TouchableOpacity
                style={[styles.categoryCard, { backgroundColor: colors.primary + '15' }]}
                onPress={handlePremiumSelect}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={styles.categoryIcon}>⭐</Text>
                  <Text style={styles.categoryCardTitle}>Premium</Text>
                  <Text style={styles.categoryCardCount}>
                    {challenges.filter(c => c.is_premium_only).length} ideas
                  </Text>
                </View>
                <Text style={styles.categoryCardArrow}>→</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Regular Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📂 Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            {Object.entries(categories).map(([categoryName, categoryChallenges]) => (
              <TouchableOpacity
                key={categoryName}
                style={[styles.categoryCard, { backgroundColor: colors.primary + '15' }]}
                onPress={() => handleCategorySelect(categoryName)}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={styles.categoryCardTitle}>{categoryName}</Text>
                  <Text style={styles.categoryCardCount}>
                    {categoryChallenges.length} {categoryChallenges.length === 1 ? 'idea' : 'ideas'}
                  </Text>
                </View>
                <Text style={styles.categoryCardArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
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
  limitReachedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  limitReachedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'center',
    marginBottom: 16,
  },
  limitReachedSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  firstSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  horizontalContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterChipTextSelected: {
    color: colors.surface,
  },
  categoryCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryCardContent: {
    flex: 1,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  categoryCardDuration: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryCardCount: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  categoryCardArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
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
  deckContainer: {
    flex: 1,
  },
  deckActions: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});