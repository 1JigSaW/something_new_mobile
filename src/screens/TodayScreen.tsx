import React, { useState } from 'react';
import { View, ScrollView, Text as RNText, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import Header from '../ui/layout/Header';
import HeroCard from '../ui/layout/HeroCard';
import Text from '../ui/atoms/Text';
import Button from '../ui/atoms/Button';
import CompletionModal from '../ui/molecules/CompletionModal';
import BeautifulLoader from '../ui/atoms/BeautifulLoader';
import { useChallengeContext } from '../context/ChallengeContext';
import { useHealthQuery } from '../features/examples/useHealthQuery';
import { colors, timeSlotColors, spacing, borderRadius, shadows, typography } from '../styles';

type TimeSlot = 'small' | 'medium' | 'large';

export default function TodayScreen() {
  const { data, isLoading } = useHealthQuery();
  const navigation = useNavigation();
  const { selectedForToday, setSelectedForToday } = useChallengeContext();
  
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<Array<{
    id: number;
    title: string;
    description: string;
    duration: string;
    size: TimeSlot;
  }>>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<{
    id: number;
    title: string;
    description: string;
    duration: string;
    size: TimeSlot;
  } | null>(null);
  const [replacementsLeft, setReplacementsLeft] = useState(1);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const timeSlots = [
    { key: 'small' as TimeSlot, label: 'Up to 30 min', emoji: '⚡', color: timeSlotColors.small },
    { key: 'medium' as TimeSlot, label: '30 min to 2 hours', emoji: '🎯', color: timeSlotColors.medium },
    { key: 'large' as TimeSlot, label: '2+ hours', emoji: '🚀', color: timeSlotColors.large },
  ];

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time);
    
    // Генерируем 3 челленджа: 1 случайный + 2 из той же категории времени
    const challenges = [
      {
        id: 1,
        title: 'Learn TypeScript Basics',
        description: 'Complete a 15-minute tutorial on TypeScript fundamentals and create your first interface',
        duration: '15 min',
        size: time,
      },
      {
        id: 2,
        title: 'Mindful Breathing Session',
        description: 'Practice deep breathing exercises for 10 minutes to improve focus and reduce stress',
        duration: '10 min',
        size: time,
      },
      {
        id: 3,
        title: 'Quick Home Workout',
        description: 'Complete a 20-minute bodyweight workout routine in your living room',
        duration: '20 min',
        size: time,
      }
    ];
    
    setDailyChallenges(challenges);
  };



  const handleSelectChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
  };

  const handleStartChallenge = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to mark this challenge as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, completed', 
          onPress: () => setShowCompletionModal(true)
        }
      ]
    );
  };

  const handleConfirmCompletion = () => {
    setShowCompletionModal(false);
    setDayCompleted(true);
  };

  const handleChooseCustom = () => {
    navigation.navigate('Explore' as never);
  };



  const handleReplace = () => {
    if (replacementsLeft > 0) {
      setReplacementsLeft(replacementsLeft - 1);
      // Generate new set of challenges
      const newChallenges = [
        {
          id: Math.floor(Math.random() * 1000),
          title: 'New Random Challenge',
          description: 'A fresh challenge to keep you motivated!',
          duration: '20 min',
          size: selectedTime!,
        },
        {
          id: Math.floor(Math.random() * 1000) + 1,
          title: 'Alternative Option',
          description: 'Another great challenge for your time slot',
          duration: '25 min',
          size: selectedTime!,
        },
        {
          id: Math.floor(Math.random() * 1000) + 2,
          title: 'Third Choice',
          description: 'One more option to consider',
          duration: '18 min',
          size: selectedTime!,
        }
      ];
      setDailyChallenges(newChallenges);
      setSelectedChallenge(null); // Сбрасываем выбор
    }
  };

  return (
    <Screen>
      <Container>
        <ScrollView style={{ paddingVertical: spacing['2xl'] }}>
          <Header 
            title="Today" 
            subtitle={dayCompleted ? "Day completed! 🎉" : "How much time do you have?"} 
          />
          
          <View style={{ height: spacing['3xl'] }} />
          
          {!selectedTime && !dayCompleted && (
            <View style={{ alignItems: 'center' }}>
              <Text variant="title" color="default">
                Choose your time
              </Text>
              <View style={{ height: spacing.xl }} />
              <View style={{ gap: spacing.lg, width: '100%' }}>
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.key}
                    title={`${slot.emoji} ${slot.label}`}
                    onPress={() => handleTimeSelect(slot.key)}
                    variant="secondary"
                    style={{ backgroundColor: slot.color }}
                  />
                ))}
              </View>
            </View>
          )}

          {selectedTime && dailyChallenges.length > 0 && !selectedChallenge && !dayCompleted && (
            <View style={{ alignItems: 'center' }}>
              <View style={{ marginBottom: spacing.xl }}>
                <Text variant="subtitle" color="muted">
                  Choose your challenge for today
                </Text>
              </View>
              
              <View style={{ gap: spacing.lg, width: '100%' }}>
                {dailyChallenges.map((challenge, index) => (
                  <View
                    key={challenge.id}
                    style={{
                      backgroundColor: index === 0 ? colors.primary : colors.surface,
                      borderRadius: borderRadius.lg,
                      padding: spacing.lg,
                      width: '100%',
                      borderWidth: index === 0 ? 2 : 1,
                      borderColor: index === 0 ? colors.primary : colors.surfaceSecondary,
                      ...shadows.sm,
                    }}
                  >
                    {index === 0 && (
                      <View style={{ 
                        position: 'absolute', 
                        top: -8, 
                        left: spacing.md,
                        backgroundColor: colors.accent,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 4,
                        borderRadius: borderRadius.sm,
                      }}>
                        <RNText style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                          RECOMMENDED
                        </RNText>
                      </View>
                    )}
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                      <View style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: index === 0 ? 'white' : colors.secondary,
                        marginRight: spacing.sm 
                      }} />
                      <View style={{ flex: 1 }}>
                        {index === 0 ? (
                          <RNText style={{ fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 8 }}>
                            {challenge.title}
                          </RNText>
                        ) : (
                          <Text variant="subtitle" color="default">
                            {challenge.title}
                          </Text>
                        )}
                        {index === 0 ? (
                          <RNText style={{ color: 'white', marginBottom: 4 }}>
                            {challenge.description}
                          </RNText>
                        ) : (
                          <Text color="muted">
                            {challenge.description}
                          </Text>
                        )}
                        {index === 0 ? (
                          <RNText style={{ color: 'white', marginTop: 4 }}>
                            {challenge.duration}
                          </RNText>
                        ) : (
                          <View style={{ marginTop: 4 }}>
                            <Text color="muted">
                              {challenge.duration}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <Button 
                      title={index === 0 ? "Choose This" : "Select"}
                      onPress={() => handleSelectChallenge(challenge)}
                      variant={index === 0 ? 'secondary' : 'primary'}
                      style={{ 
                        backgroundColor: index === 0 ? 'white' : colors.primary,
                        marginTop: spacing.md
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTime && selectedChallenge && !dayCompleted && (
            <View style={{ alignItems: 'center' }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: timeSlots.find(s => s.key === selectedChallenge.size)?.color || colors.primary,
                marginBottom: spacing.xl,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RNText style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: 'white' 
                }}>
                  {selectedChallenge.size === 'small' ? 'S' : selectedChallenge.size === 'medium' ? 'M' : 'L'}
                </RNText>
              </View>
              
              <Text variant="title" color="default">
                {selectedChallenge.title}
              </Text>
              
              <View style={{ height: spacing.lg }} />
              
              <Text color="muted">
                {selectedChallenge.description}
              </Text>
              
              <View style={{ height: spacing['2xl'] }} />
              
              <View style={{ gap: spacing.lg, width: '100%' }}>
                <Button 
                  title="Complete Challenge" 
                  onPress={handleStartChallenge}
                  style={{ backgroundColor: colors.secondary }}
                />
                <View style={{ flexDirection: 'row', gap: spacing.md }}>
                  <Button 
                    title={`Replace (${replacementsLeft})`}
                    variant="secondary" 
                    onPress={handleReplace}
                    disabled={replacementsLeft === 0}
                    style={{ flex: 1 }}
                  />
                  <Button 
                    title="Choose Custom" 
                    variant="ghost" 
                    onPress={handleChooseCustom}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </View>
          )}

          {dayCompleted && (
            <View style={{ alignItems: 'center' }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: colors.success,
                marginBottom: spacing.xl,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RNText style={{ 
                  fontSize: 32, 
                  fontWeight: 'bold', 
                  color: 'white' 
                }}>
                  ✓
                </RNText>
              </View>
              <Text variant="title" color="default">
                Great job!
              </Text>
              <View style={{ height: spacing.lg }} />
              <Text color="muted">
                You completed today's challenge. 
                Tomorrow brings a new adventure!
              </Text>
              <View style={{ height: spacing['2xl'] }} />
              <Button 
                title="View Progress" 
                onPress={() => navigation.navigate('Progress' as never)}
                variant="secondary"
                style={{ backgroundColor: colors.primary }}
              />
            </View>
          )}

          {selectedForToday.length > 0 && (
            <>
              <View style={{ height: spacing['3xl'] }} />
              <View style={{ alignItems: 'center' }}>
                <Text variant="subtitle" color="muted">
                  Selected for today
                </Text>
                <View style={{ height: spacing.lg }} />
                <View style={{ gap: spacing.md, width: '100%' }}>
                  {selectedForToday.map((item, index) => (
                    <View key={item.id} style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center',
                      backgroundColor: colors.surfaceSecondary,
                      padding: spacing.md,
                      borderRadius: borderRadius.lg,
                    }}>
                      <View style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: item.size === 'small' ? colors.secondary : 
                                       item.size === 'medium' ? colors.primary : colors.accent,
                        marginRight: spacing.md 
                      }} />
                      <View style={{ flex: 1 }}>
                        <Text color="default">
                          {item.title}
                        </Text>
                      </View>
                      <Button 
                        title="Remove"
                        variant="ghost"
                        onPress={() => setSelectedForToday(selectedForToday.filter((_, i) => i !== index))}
                        style={{ paddingHorizontal: spacing.sm }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {isLoading && (
            <View style={{ marginTop: spacing['2xl'], alignItems: 'center' }}>
              <BeautifulLoader size="large" color={colors.primary} />
              <View style={{ height: spacing.lg }} />
              <Text color="muted">Loading your day...</Text>
            </View>
          )}
        </ScrollView>
      </Container>

      <CompletionModal
        visible={showCompletionModal}
        challengeTitle={selectedChallenge?.title || ''}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={handleConfirmCompletion}
      />


    </Screen>
  );
}


