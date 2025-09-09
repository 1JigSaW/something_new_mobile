import React from 'react';
import { View, ScrollView, Text as RNText } from 'react-native';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import Header from '../ui/layout/Header';
import Text from '../ui/atoms/Text';
import Button from '../ui/atoms/Button';
import BeautifulLoader from '../ui/atoms/BeautifulLoader';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../styles';

export default function ProgressScreen() {
  const { user, signOut } = useAuth();
  const currentStreak = 7;
  const totalChallenges = 23;
  const thisWeekChallenges = 5;

  return (
    <Screen>
      <Container>
        <ScrollView style={{ paddingVertical: spacing.lg }}>
          <Header 
            title="Progress" 
            subtitle="Your streaks and stats"
            right={
              user?.provider !== 'anonymous' && (
                <Button 
                  title="Logout" 
                  variant="ghost" 
                  onPress={signOut}
                  style={{ paddingHorizontal: spacing.sm }}
                />
              )
            }
          />
          
          <View style={{ marginTop: spacing['2xl'] }}>
            {/* Streak Ring */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              alignItems: 'center',
              ...shadows.md,
            }}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 8,
                borderColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.lg,
              }}>
                <RNText style={{ fontSize: 32, fontWeight: 'bold', color: colors.primary }}>
                  {currentStreak}
                </RNText>
                <Text color="muted">
                  days
                </Text>
              </View>
              <Text variant="subtitle" color="default">
                🔥 Current Streak
              </Text>
              <View style={{ height: spacing.sm }} />
              <Text color="muted">
                Keep it up! You're on fire!
              </Text>
            </View>

            {/* Stats */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              marginTop: spacing.lg,
              ...shadows.md,
            }}>
              <Text variant="subtitle" color="default">
                📊 Your Stats
              </Text>
              <View style={{ height: spacing.lg }} />
              
              <View style={{ gap: spacing.md }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text color="muted">Total Challenges</Text>
                  <Text color="default">{totalChallenges}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text color="muted">This Week</Text>
                  <Text color="default">{thisWeekChallenges}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text color="muted">Best Streak</Text>
                  <Text color="default">12 days</Text>
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              marginTop: spacing.lg,
              ...shadows.md,
            }}>
              <Text variant="subtitle" color="default">
                📈 Recent Activity
              </Text>
              <View style={{ height: spacing.lg }} />
              <Text color="muted">
                No recent activity to show
              </Text>
            </View>
          </View>
        </ScrollView>
      </Container>
    </Screen>
  );
}


