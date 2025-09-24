import React from 'react';
import { View, Modal, Text as RNText } from 'react-native';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import { colors, spacing, borderRadius, shadows } from '../../styles';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAppleAuth: () => void;
  onGoogleAuth: () => void;
}

export default function AuthModal({ 
  visible, 
  onClose, 
  onAppleAuth, 
  onGoogleAuth 
}: AuthModalProps) {
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
          <RNText style={{ fontSize: 64, marginBottom: spacing.lg }}>🔐</RNText>
          
          <Text variant="title" color="default">
            Welcome to Something New
          </Text>
          
          <View style={{ height: spacing.md }} />
          
          <Text color="muted">
            Sign in to track your progress and sync across devices
          </Text>
          
          <View style={{ height: spacing.xl }} />
          
          <View style={{ gap: spacing.md, width: '100%' }}>
            <Button 
              title="Continue with Apple" 
              onPress={onAppleAuth}
              style={{ backgroundColor: colors.textPrimary }}
            />
            <Button 
              title="Continue with Google" 
              onPress={onGoogleAuth}
              style={{ backgroundColor: colors.info }}
            />
            <Button 
              title="Skip for now" 
              variant="ghost" 
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
