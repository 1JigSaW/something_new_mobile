import React, { useState } from 'react';
import { View, FlatList, Modal, ScrollView, Text as RNText, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../ui/Screen';
import Text from '../ui/atoms/Text';
import Button from '../ui/atoms/Button';
import { useChallengesQuery } from '../features/challenges/useChallengesQuery';
import { useChallengeContext } from '../context/ChallengeContext';
import BeautifulLoader from '../ui/atoms/BeautifulLoader';
import Empty from '../ui/Empty';
import Header from '../ui/layout/Header';
import SectionHeader from '../ui/layout/SectionHeader';
import Container from '../ui/layout/Container';
import Tag from '../ui/atoms/Tag';
import ChallengeCard from '../ui/molecules/ChallengeCard';
import FadeIn from '../ui/molecules/FadeIn';
import { colors, timeSlotColors, spacing, borderRadius, shadows, typography } from '../styles';

export default function ChooseScreen() {
  const { data, isLoading, refetch } = useChallengesQuery({ freeOnly: true });
  const navigation = useNavigation();
  const { setSelectedForToday, selectedForToday } = useChallengeContext();
  const [selected, setSelected] = useState<
    { id: number, title: string, size: 'small' | 'medium' | 'large' } | null
  >(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter challenges based on selected filter
  const filteredChallenges = data?.filter(challenge => {
    if (selectedFilter === 'all') return true;
    return challenge.size === selectedFilter;
  }) || [];

  // Debug logging
  console.log('ChooseScreen - data:', data);
  console.log('ChooseScreen - isLoading:', isLoading);
  console.log('ChooseScreen - filteredChallenges:', filteredChallenges);

  const handleStartChallenge = (challenge: any) => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to start "${challenge.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            Alert.alert('Challenge Started!', 'Good luck with your challenge! 🎉');
          }
        }
      ]
    );
  };

  const handleAddToPlan = (challenge: any) => {
    if (selectedForToday.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add up to 3 challenges per day.');
      return;
    }
    
    Alert.alert(
      'Add to Plan',
      `Add "${challenge.title}" to your daily plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            setSelectedForToday([...selectedForToday, {
              id: challenge.id,
              title: challenge.title,
              size: challenge.size
            }]);
            Alert.alert('Added!', 'Challenge added to your plan! 📅');
            navigation.navigate('Today' as never);
          }
        }
      ]
    );
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'small', label: 'Up to 30 min' },
    { key: 'medium', label: '30 min to 2h' },
    { key: 'large', label: '2+ hours' },
  ];

  return (
    <Screen>
      <Container>
        <ScrollView style={{ paddingVertical: spacing.lg }}>
          <Header title="Explore" subtitle="Discover new challenges" />
          
          <View style={{ marginTop: spacing.xl }}>
            <View style={{ marginBottom: spacing.md }}>
              <Text variant="subtitle" color="default">
                Filter by duration
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.xs }}
            >
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  title={filter.label}
                  onPress={() => setSelectedFilter(filter.key)}
                  variant={selectedFilter === filter.key ? 'primary' : 'secondary'}
                  style={{ 
                    backgroundColor: selectedFilter === filter.key ? colors.primary : colors.surfaceSecondary,
                    minWidth: 100,
                    borderRadius: borderRadius.xl,
                    paddingVertical: spacing.md,
                    ...shadows.sm,
                  }}
                />
              ))}
            </ScrollView>
          </View>

          {/* Categories Section */}
          <View style={{ marginTop: spacing['2xl'] }}>
            <View style={{ marginBottom: spacing.md }}>
              <Text variant="subtitle" color="default">
                Categories
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.xs }}
            >
              {[
                { name: 'Programming', icon: '💻', color: colors.primary },
                { name: 'Design', icon: '🎨', color: colors.secondary },
                { name: 'Math', icon: '📐', color: colors.accent },
                { name: 'Science', icon: '🔬', color: colors.success },
                { name: 'Language', icon: '🌍', color: colors.info },
              ].map((category, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    alignItems: 'center',
                    minWidth: 80,
                    ...shadows.sm,
                  }}
                >
                  <RNText style={{ fontSize: 24, marginBottom: spacing.sm }}>{category.icon}</RNText>
                  <RNText style={{ 
                    fontSize: typography.caption.fontSize,
                    color: colors.textPrimary,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                    {category.name}
                  </RNText>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ marginTop: spacing['2xl'] }}>
            <Text variant="subtitle" color="default">
              Available challenges
            </Text>
            <View style={{ height: spacing.lg }} />
            
            {isLoading && (
              <View style={{ 
                backgroundColor: colors.surface, 
                borderRadius: borderRadius.lg, 
                padding: spacing['2xl'], 
                alignItems: 'center',
                ...shadows.sm,
              }}>
                <BeautifulLoader size="large" color={colors.primary} />
                <View style={{ height: spacing.lg }} />
                <Text color="muted">Loading challenges...</Text>
              </View>
            )}
            
            {!isLoading && (filteredChallenges.length ?? 0) === 0 && (
              <View style={{ 
                backgroundColor: colors.surface, 
                borderRadius: borderRadius.lg, 
                padding: spacing['2xl'], 
                alignItems: 'center',
                ...shadows.sm,
              }}>
                <View style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 24, 
                  backgroundColor: colors.surfaceSecondary,
                  marginBottom: spacing.md,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text color="muted" variant="caption">?</Text>
                </View>
                <Text variant="subtitle" color="default">
                  No challenges
                </Text>
                <View style={{ height: spacing.sm }} />
                <Text color="muted">
                  Try different filters
                </Text>
              </View>
            )}
            
            {!isLoading && (filteredChallenges.length ?? 0) > 0 && (
              <View style={{ gap: spacing.lg }}>
                {filteredChallenges.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.xl,
                      padding: spacing.xl,
                      ...shadows.md,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md }}>
                      <View style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: 6, 
                        backgroundColor: item.size === 'small' ? colors.secondary : 
                                       item.size === 'medium' ? colors.primary : colors.accent,
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
                            {item.estimated_duration_min ? `${item.estimated_duration_min} min` : 
                             item.size === 'small' ? '5-30 min' : item.size === 'medium' ? '30-90 min' : '2h+'}
                          </Text>
                        </View>
                        {item.category && (
                          <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center',
                            marginBottom: spacing.sm,
                          }}>
                            <RNText style={{ fontSize: 16, marginRight: spacing.sm }}>🏷️</RNText>
                            <Text color="muted">
                              {item.category}
                            </Text>
                          </View>
                        )}
                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center',
                        }}>
                          <RNText style={{ fontSize: 16, marginRight: spacing.sm }}>⭐</RNText>
                          <Text color="muted">
                            {item.size === 'small' ? 'Beginner' : item.size === 'medium' ? 'Intermediate' : 'Advanced'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                      <Button 
                        title="Start Now" 
                        onPress={() => handleStartChallenge(item)}
                        style={{ 
                          flex: 1, 
                          backgroundColor: colors.primary,
                          borderRadius: borderRadius.xl,
                          paddingVertical: spacing.lg,
                        }}
                      />
                      <Button 
                        title="Add to Plan" 
                        variant="secondary" 
                        onPress={() => handleAddToPlan(item)}
                        style={{ 
                          flex: 1,
                          borderRadius: borderRadius.xl,
                          paddingVertical: spacing.lg,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={!!selected}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelected(null)}
        >
          <View style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.4)', 
            alignItems: 'center', 
            justifyContent: 'flex-end' 
          }}>
            <View style={{ 
              width: '100%', 
              backgroundColor: colors.surface, 
              borderTopLeftRadius: 20, 
              borderTopRightRadius: 20, 
              padding: spacing.xl,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                <View style={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: 6, 
                  backgroundColor: selected?.size === 'small' ? colors.secondary : 
                                 selected?.size === 'medium' ? colors.primary : colors.accent,
                  marginRight: spacing.sm 
                }} />
                <Text variant="subtitle" color="default">
                  {selected?.title}
                </Text>
              </View>
              <Text color="muted">
                Size: {selected?.size === 'small' ? 'Small (5-30 min)' : selected?.size === 'medium' ? 'Medium (30-90 min)' : 'Large (2h+)'}
              </Text>
              <View style={{ height: spacing.xl }} />
              <View style={{ gap: spacing.md }}>
                <Button 
                  title="Start Now" 
                  onPress={() => handleStartChallenge(selected)} 
                  style={{ backgroundColor: colors.secondary }}
                />
                <Button 
                  title="Add to Plan" 
                  variant="secondary" 
                  onPress={() => handleAddToPlan(selected)} 
                />
                <Button 
                  title="Close" 
                  variant="ghost" 
                  onPress={() => setSelected(null)} 
                />
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    </Screen>
  );
}


