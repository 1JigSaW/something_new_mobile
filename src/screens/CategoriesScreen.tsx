import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageHeader from '../ui/layout/PageHeader';
import EmptyState from '../ui/molecules/EmptyState';
import ErrorState from '../ui/molecules/ErrorState';
import { SwipeDeck } from '../ui/organisms/SwipeDeck';
import { useApp } from '../context/AppContext';
import { useRandomChallengesQuery } from '../features';
import { colors } from '../styles';
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
    getDisplayChallenges,
    markAsSelected,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sizeKeys = ['small', 'medium', 'large'];
  const sizeParam = selectedCategory && sizeKeys.includes(selectedCategory) ? selectedCategory : undefined;
  const categoryParam = selectedCategory && !sizeKeys.includes(selectedCategory) ? selectedCategory : undefined;

  const { 
    data: challenges = [], 
    isLoading: loading, 
    error: queryError 
  } = useRandomChallengesQuery({
    limit: 20,
    freeOnly: !isPremium,
    size: sizeParam as any,
    category: categoryParam as any,
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
    if (sizeKeys.includes(selectedCategory)) {
      filteredChallenges = filteredChallenges.filter(challenge => challenge.size === selectedCategory);
    } else {
      filteredChallenges = filteredChallenges.filter(challenge => challenge.category === selectedCategory);
    }
  }
  // On categories root we don't need to compute empty state; keep full list

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleSwipeRight = (challenge: Challenge) => {
    if (!canSwipe()) {
      Alert.alert(
        'Swipe limit reached',
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today.`
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
        `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today.`
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
    const categoryChallenges = filteredChallenges;
    const unviewedCategoryChallenges = getDisplayChallenges(categoryChallenges, { allowRepeatsOnExhausted: true });

    return (
      <View style={styles.container}>
        <PageHeader 
          title={selectedCategory}
          left={(
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          )}
        />

        <SwipeDeck
          challenges={unviewedCategoryChallenges.length > 0 ? unviewedCategoryChallenges : getDisplayChallenges(categoryChallenges, { allowRepeatsOnExhausted: true })}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onAddToFavorites={handleAddToFavorites}
          onSwipe={handleSwipe}
          disabled={!canSwipe()}
          swipeCount={swipesUsedToday}
          maxSwipes={maxSwipesPerDay}
          onLimitReached={() => {
            Alert.alert(
              'Swipe limit reached',
              `You've used ${swipesUsedToday}/${maxSwipesPerDay} swipes today.`
            );
          }}
        />
      </View>
    );
  }

  if (filteredChallenges.length === 0) {
    return (
      <View style={styles.container}>
        <PageHeader title="Categories" />
        <EmptyState 
          title="All viewed!" 
          subtitle="You've seen all available challenges. Come back tomorrow for new ones!" 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Categories"
        left={(
          selectedCategory ? (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          ) : null
        )}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>Size</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            {[
              { key: 'small', label: 'Small', color: colors.categorySmall },
              { key: 'medium', label: 'Medium', color: colors.categoryMedium },
              { key: 'large', label: 'Large', color: colors.categoryLarge },
            ].map((size) => (
              <View key={`wrap-${size.key}`} style={styles.cardWrapper}>
              <TouchableOpacity
                key={size.key}
                style={[styles.categoryCard, { backgroundColor: `${size.color}15` }]}
                onPress={() => handleCategorySelect(size.key)}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={[styles.categoryCardTitle]}>{size.label}</Text>
                  <Text style={styles.categoryCardCount}>
                    {challenges.filter(c => c.size === size.key).length} ideas
                  </Text>
                </View>
                <Text style={styles.categoryCardArrow}>→</Text>
              </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            {[
              { key: 'quick', label: 'Quick', color: colors.categoryQuick, duration: '≤30m' },
              { key: 'medium', label: 'Medium', color: colors.categoryMedium, duration: '30-90m' },
              { key: 'long', label: 'Long', color: colors.categoryLong, duration: '90m+' },
            ].map((duration) => (
              <View key={`wrap-${duration.key}`} style={styles.cardWrapper}>
              <TouchableOpacity
                key={duration.key}
                style={[styles.categoryCard, { backgroundColor: `${duration.color}15` }]}
                onPress={() => {}}
              >
                <View style={styles.categoryCardContent}>
                  <Text style={[styles.categoryCardTitle]}>{duration.label}</Text>
                  <Text style={styles.categoryCardDuration}>{duration.duration}</Text>
                </View>
                <Text style={styles.categoryCardArrow}>→</Text>
              </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalContent}
          >
            {Object.entries(categories).map(([categoryName, categoryChallenges]) => {
              const unviewedCount = getDisplayChallenges(categoryChallenges, { allowRepeatsOnExhausted: false }).length;
              if (unviewedCount === 0) return null;
              return (
                <View key={`wrap-${categoryName}`} style={styles.cardWrapper}>
                <TouchableOpacity
                  key={categoryName}
                  style={[styles.categoryCard, { backgroundColor: `${colors.primary}15` }]}
                  onPress={() => handleCategorySelect(categoryName)}
                >
                  <View style={styles.categoryCardContent}>
                    <Text style={styles.categoryCardTitle}>{categoryName}</Text>
          {/* removed left counter */}
                  </View>
                  <Text style={styles.categoryCardArrow}>→</Text>
                </TouchableOpacity>
                </View>
              );
            })}
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
  scrollView: {
    flex: 1,
    padding: 12,
  },
  horizontalScroll: {
    paddingVertical: 8,
  },
  horizontalContent: {
    paddingHorizontal: 12,
    paddingRight: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  firstSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginLeft: 12,
  },
  categoryCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    height: 140,
    marginRight: 0,
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
  categoryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  categoryCardDuration: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryCardCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryCardArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  cardWrapper: {
    paddingRight: 12,
  },
  // removed old grid styles
  categoryPill: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 10,
  },
  pillTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  pillCount: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
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
  emptyCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function getCategoryColor(category: string, alpha: number): string {
  const base = {
    health: '#16a34a',
    learning: '#2563eb',
    productivity: '#7c3aed',
    social: '#f59e0b',
    creative: '#ec4899',
    mindfulness: '#06b6d4',
    other: '#64748b',
  }[category as keyof Record<string, string>] || '#64748b';
  if (alpha >= 1) return base;
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${base}${a}`;
}