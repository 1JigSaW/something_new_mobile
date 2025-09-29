import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Challenge } from '../types/challenge';
import { ScreenHeader } from '../ui/molecules';
import { ChallengeCard } from '../ui/molecules';
import { ScreenEmptyState } from '../ui/molecules';
import { colors } from '../styles';

export default function FavoritesScreen() {
  const {
    favorites,
    removeFromFavorites,
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

  const handleRemoveFromFavorites = (challengeId: number) => {
    const challenge = favorites.find(fav => fav.id === challengeId);
    if (!challenge) return;
    
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
          onPress: () => removeFromFavorites(challengeId),
        },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader 
          title="Favorites" 
          subtitle="Saved ideas" 
        />
        
        <ScreenEmptyState 
          title="No favorites yet"
          subtitle="Add ideas you like to favorites to return to them later"
          icon="⭐"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Favorites" 
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'idea' : 'ideas'}`}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {favorites.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            variant="favorite"
            onSelect={handleSelectChallenge}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
});