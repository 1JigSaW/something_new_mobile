import React, { useState } from 'react';
import { View, FlatList, Text as RNText, Alert } from 'react-native';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import Header from '../ui/layout/Header';
import Text from '../ui/atoms/Text';
import Button from '../ui/atoms/Button';
import { useChallengesQuery } from '../features/challenges/useChallengesQuery';
import { useApp } from '../context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../styles';

export default function ChooseScreen() {
  const { data, isLoading } = useChallengesQuery({ freeOnly: true });
  const { setActiveChallenge, canTakeNewChallenge, addToFavorites } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter challenges based on selected filter
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

  const getEmoji = (size: string) => {
    switch (size) {
      case 'small': return '⚡';
      case 'medium': return '🎯';
      case 'large': return '🚀';
      default: return '⭐';
    }
  };

  const renderChallenge = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.md,
        ...shadows.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md }}>
        <View style={{ 
          width: 12, 
          height: 12, 
          borderRadius: 6, 
          backgroundColor: colors.primary,
          marginRight: spacing.md,
          marginTop: 4,
        }} />
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: spacing.sm }}>
            <Text variant="subtitle" color="default">
              {item.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <RNText style={{ fontSize: 16, marginRight: spacing.sm }}>⏱️</RNText>
            <Text color="muted">
              {item.estimated_duration_min ? `${item.estimated_duration_min}m` : 
               item.size === 'small' ? '5-30m' : item.size === 'medium' ? '30-90m' : '2h+'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        <Button 
          title="Start" 
          onPress={() => {
            if (!canTakeNewChallenge()) {
              Alert.alert('Limit Reached', 'You have already completed a challenge today. Come back tomorrow!');
              return;
            }
            setActiveChallenge(item);
            Alert.alert('Challenge Started!', 'Good luck with your challenge! 🎉');
          }}
          style={{ 
            flex: 1, 
            backgroundColor: colors.primary,
            borderRadius: borderRadius.xl,
            paddingVertical: spacing.lg,
          }}
        />
        <Button 
          title="Add" 
          variant="secondary" 
          onPress={() => {
            addToFavorites(item);
            Alert.alert('Added!', 'Challenge added to your favorites! 📅');
          }}
          style={{ 
            flex: 1,
            borderRadius: borderRadius.xl,
            paddingVertical: spacing.lg,
          }}
        />
      </View>
    </View>
  );

  return (
    <Screen>
      <Container>
        <Header 
          title="Explore" 
          subtitle="Challenges"
        />
        
        <View style={{ flex: 1 }}>
          {/* Filter Buttons */}
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

          {/* Challenges List */}
          {isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text color="muted">Loading challenges...</Text>
            </View>
          ) : filteredChallenges.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text color="muted">No challenges found</Text>
            </View>
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