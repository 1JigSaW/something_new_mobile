import React from 'react';
import { View, Modal, Text as RNText } from 'react-native';
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
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: spacing.xl,
      }}>
        <View style={{ 
          backgroundColor: colors.surface, 
          borderRadius: borderRadius.xl, 
          padding: spacing['2xl'],
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
          ...shadows.lg,
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
        </View>
      </View>
    </Modal>
  );
}
