import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Text as RNText, Animated } from 'react-native';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import { colors, spacing, borderRadius, shadows } from '../../styles';

interface Challenge {
  id: number;
  title: string;
  description: string;
  duration: string;
  size: 'small' | 'medium' | 'large';
}

interface ChallengeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (challenge: Challenge) => void;
}

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: 'Learn TypeScript Basics',
    description: 'Complete a 15-minute tutorial on TypeScript fundamentals',
    duration: '15 min',
    size: 'small'
  },
  {
    id: 2,
    title: 'Practice Meditation',
    description: 'Spend 20 minutes in mindful meditation',
    duration: '20 min',
    size: 'small'
  },
  {
    id: 3,
    title: 'Read a Chapter',
    description: 'Read one chapter from your current book',
    duration: '45 min',
    size: 'medium'
  },
  {
    id: 4,
    title: 'Learn Guitar Chord',
    description: 'Master a new guitar chord and practice songs',
    duration: '60 min',
    size: 'medium'
  },
  {
    id: 5,
    title: 'Build a Small Project',
    description: 'Create a simple web app or mobile feature',
    duration: '3h',
    size: 'large'
  }
];

export default function ChallengeSelectionModal({ 
  visible, 
  onClose, 
  onSelect 
}: ChallengeSelectionModalProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = () => {
    if (selectedChallenge) {
      onSelect(selectedChallenge);
      setSelectedChallenge(null);
    }
  };

  const getEmoji = (size: string) => {
    switch (size) {
      case 'small': return '⚡';
      case 'medium': return '🎯';
      case 'large': return '🚀';
      default: return '⭐';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: spacing.xl,
        opacity: opacityAnim,
      }}>
        <Animated.View style={{ 
          width: '100%', 
          backgroundColor: colors.surface, 
          borderRadius: borderRadius.xl, 
          padding: spacing.xl,
          maxHeight: '80%',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
          transform: [{ scale: scaleAnim }],
        }}>
          <Text variant="title" color="default">
            Choose Your Challenge
          </Text>
          
          <View style={{ height: spacing.lg }} />
          
          <ScrollView style={{ maxHeight: 400 }}>
            <View style={{ gap: spacing.md }}>
              {mockChallenges.map((challenge) => (
                <View
                  key={challenge.id}
                  style={{
                    backgroundColor: selectedChallenge?.id === challenge.id ? colors.primary + '20' : colors.surfaceSecondary,
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                    borderWidth: selectedChallenge?.id === challenge.id ? 2 : 0,
                    borderColor: selectedChallenge?.id === challenge.id ? colors.primary : 'transparent',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                    <RNText style={{ fontSize: 20, marginRight: spacing.sm }}>
                      {getEmoji(challenge.size)}
                    </RNText>
                    <View style={{ flex: 1 }}>
                      <Text variant="subtitle" color="default">
                        {challenge.title}
                      </Text>
                      <Text color="muted">
                        {challenge.duration} • {challenge.size === 'small' ? 'Small' : challenge.size === 'medium' ? 'Medium' : 'Large'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text color="muted">
                    {challenge.description}
                  </Text>
                  <View style={{ height: spacing.md }} />
                  
                  <Button 
                    title={selectedChallenge?.id === challenge.id ? "Selected" : "Select"}
                    onPress={() => setSelectedChallenge(challenge)}
                    variant={selectedChallenge?.id === challenge.id ? "primary" : "secondary"}
                    style={{ 
                      backgroundColor: selectedChallenge?.id === challenge.id ? colors.primary : colors.surfaceSecondary,
                    }}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
          
          <View style={{ height: spacing.xl }} />
          
          <View style={{ gap: spacing.md }}>
            <Button 
              title="Confirm Selection" 
              onPress={handleSelect}
              disabled={!selectedChallenge}
              style={{ backgroundColor: colors.secondary }}
            />
            <Button 
              title="Cancel" 
              variant="ghost" 
              onPress={onClose}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
