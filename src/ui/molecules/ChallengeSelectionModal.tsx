import React, { useState } from 'react';
import { View, Modal, ScrollView, Text as RNText } from 'react-native';
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
      animationType="slide"
      onRequestClose={onClose}
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
          maxHeight: '80%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
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
        </View>
      </View>
    </Modal>
  );
}
