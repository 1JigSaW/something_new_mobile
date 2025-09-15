import React, { useEffect } from 'react';
import { View, Modal, Text as RNText, Animated } from 'react-native';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import { colors, spacing, borderRadius, shadows } from '../../styles';

interface CompletionModalProps {
  visible: boolean;
  challengeTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CompletionModal({ 
  visible, 
  challengeTitle, 
  onClose, 
  onConfirm 
}: CompletionModalProps) {
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
          backgroundColor: colors.surface, 
          borderRadius: borderRadius.xl, 
          padding: spacing['2xl'],
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
          ...shadows.lg,
          transform: [{ scale: scaleAnim }],
        }}>
          <RNText style={{ fontSize: 64, marginBottom: spacing.lg }}>🎉</RNText>
          
          <Text variant="title" color="default">
            Challenge Completed!
          </Text>
          
          <View style={{ height: spacing.md }} />
          
          <Text color="muted">
            Great job! You completed "{challengeTitle}"!
          </Text>
          
          <View style={{ height: spacing.xl }} />
          
          <View style={{ gap: spacing.md, width: '100%' }}>
                            <Button 
                  title="Continue" 
                  onPress={onConfirm}
                  style={{ backgroundColor: colors.secondary }}
                />
                <Button 
                  title="Close" 
                  variant="ghost" 
                  onPress={onClose}
                />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
