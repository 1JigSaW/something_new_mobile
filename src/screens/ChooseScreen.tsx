import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import PageHeader from '../ui/layout/PageHeader';
import Text from '../ui/atoms/Text';
import Button from '../ui/atoms/Button';
import { ChallengeCard } from '../ui/molecules';
import { ScreenEmptyState } from '../ui/molecules';
import { useChallengesQuery } from '../features';
import { useApp } from '../context/AppContext';
import { spacing, borderRadius } from '../styles';

export default function ChooseScreen() {
  const { data, isLoading } = useChallengesQuery({ freeOnly: true });
  const { setActiveChallenge, canTakeNewChallenge, addToFavorites } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredChallenges = data?.filter(challenge => {
    if (selectedFilter === 'all') return true;
    return challenge.size === selectedFilter;
  }) || [];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'small', label: 'Up to 30 min' },
    { key: 'medium', label: '30 min to 2h' },
    { key: 'large', label: '2h+' },
  ];

  const handleSelectChallenge = (challenge: any) => {
    if (!canTakeNewChallenge()) {
      Alert.alert('Limit Reached', 'You have already completed a challenge today. Come back tomorrow!');
      return;
    }
    setActiveChallenge(challenge);
    Alert.alert('Challenge Started!', 'Good luck with your challenge! 🎉');
  };

  const handleAddToFavorites = (challenge: any) => {
    addToFavorites(challenge);
    Alert.alert('Added!', 'Challenge added to your favorites! 📅');
  };

  const renderChallenge = ({ item }: { item: any }) => (
    <ChallengeCard
      challenge={item}
      onSelect={handleSelectChallenge}
      onAddToFavorites={handleAddToFavorites}
      showActions={true}
    />
  );

  return (
    <Screen>
      <Container>
        <PageHeader 
          title="Explore" 
          subtitle="Challenges"
        />
        
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: spacing.lg }}>
            <View style={{ marginBottom: spacing.md }}>
              <Text variant="subtitle" color="muted">
                Duration
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  title={filter.label}
                  onPress={() => setSelectedFilter(filter.key)}
                  variant={selectedFilter === filter.key ? 'primary' : 'secondary'}
                  style={{
                    borderRadius: borderRadius.lg,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }}
                />
              ))}
            </View>
          </View>

          {isLoading ? (
            <ScreenEmptyState 
              title="Loading challenges..." 
              icon="⏳"
            />
          ) : filteredChallenges.length === 0 ? (
            <ScreenEmptyState 
              title="No challenges found" 
              subtitle="Try adjusting your filters"
              icon="🔍"
            />
          ) : (
            <FlatList
              data={filteredChallenges}
              renderItem={renderChallenge}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing.xl }}
            />
          )}
        </View>
      </Container>
    </Screen>
  );
}