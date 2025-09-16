import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SwipeDeck } from '../components/SwipeDeck';
import { useApp } from '../context/AppContext';
import { useRandomChallengesQuery } from '../features/challenges/useRandomChallengesQuery';

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

export default function CategoriesScreen() {
  const {
    activeChallenge,
    setActiveChallenge,
    addToFavorites,
    canTakeNewChallenge,
    isPremium,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Используем новый хук для получения случайных карточек
  const { 
    data: challenges = [], 
    isLoading: loading, 
    error: queryError 
  } = useRandomChallengesQuery({
    limit: 20, // Получаем больше карточек для выбора
    category: selectedCategory || undefined,
    freeOnly: !isPremium,
  });

  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);

  // Обновляем отфильтрованные карточки при изменении данных
  useEffect(() => {
    setFilteredChallenges(challenges);
  }, [challenges]);

  // Group challenges by categories
  const categories = challenges.reduce((acc, challenge) => {
    const category = challenge.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  const handleCategorySelect = (category: string) => {
    const categoryChallenges = categories[category] || [];
    const shuffled = categoryChallenges.sort(() => Math.random() - 0.5);
    setFilteredChallenges(shuffled);
    setSelectedCategory(category);
  };

  const handleSwipeRight = (challenge: Challenge) => {
    if (!canTakeNewChallenge()) {
      Alert.alert(
        'Limit Reached',
        isPremium ? 'Something went wrong' : 'You already completed a task today. Come back tomorrow!'
      );
      return;
    }

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

  const handleSwipeLeft = (challenge: Challenge) => {
    // Simply skip without restrictions in categories
    console.log('Skipped challenge:', challenge.title);
  };

  const handleAddToFavorites = (challenge: Challenge) => {
    addToFavorites(challenge);
    Alert.alert('Added to Favorites', `"${challenge.title}" added to favorites`);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setFilteredChallenges([]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </View>
    );
  }

  if (queryError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: {queryError instanceof Error ? queryError.message : 'Unknown error'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (selectedCategory) {
    // Show swipe deck for selected category
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
            disabled={!canTakeNewChallenge()}
          />
        </View>

        <View style={styles.deckActions}>
          <TouchableOpacity 
            style={styles.favoritesButton}
            onPress={() => filteredChallenges[0] && handleAddToFavorites(filteredChallenges[0])}
          >
            <Text style={styles.favoritesButtonText}>❤️ Add to Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show categories list
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Choose a category to explore ideas</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(categories).map(([categoryName, categoryChallenges]) => (
          <TouchableOpacity
            key={categoryName}
            style={styles.categoryCard}
            onPress={() => handleCategorySelect(categoryName)}
          >
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>
                {categoryName.toUpperCase()}
              </Text>
              <Text style={styles.categoryCount}>
                {categoryChallenges.length} {categoryChallenges.length === 1 ? 'idea' : 'ideas'}
              </Text>
            </View>
            <Text style={styles.categoryArrow}>→</Text>
          </TouchableOpacity>
        ))}

        {Object.keys(categories).length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No categories available</Text>
            <Text style={styles.emptyText}>
              Try refreshing or check your internet connection
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B5CF6',
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
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  categoryArrow: {
    fontSize: 20,
    color: '#8B5CF6',
    fontWeight: 'bold',
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
  deckContainer: {
    flex: 1,
  },
  deckActions: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  favoritesButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  favoritesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});