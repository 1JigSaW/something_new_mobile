import React from 'react';
import { View, ScrollView, Text as RNText } from 'react-native';
import Screen from '../ui/Screen';
import Container from '../ui/layout/Container';
import Header from '../ui/layout/Header';
import Text from '../ui/atoms/Text';
import Button from '../ui/atoms/Button';
import BeautifulLoader from '../ui/atoms/BeautifulLoader';
import StatsCard from '../ui/molecules/StatsCard';
import ProgressCard from '../ui/molecules/ProgressCard';
import AchievementCard from '../ui/molecules/AchievementCard';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../styles';

export default function ProgressScreen() {
  const { user, signOut } = useAuth();
  const currentStreak = 7;
  const totalChallenges = 23;
  const thisWeekChallenges = 5;
  const learningStreak = 12;
  const totalHours = 45;

  return (
    <Screen>
      <Container>
        <ScrollView style={{ paddingVertical: spacing.lg }}>
          <Header 
            title="Progress" 
            subtitle="Stats"
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
            {/* Main Stats Grid */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginBottom: spacing['2xl'],
              gap: spacing.md,
            }}>
              <StatsCard
                title="Streak"
                value={currentStreak}
                subtitle="days"
                icon="🔥"
                color={colors.accent}
              />
              <StatsCard
                title="Hours"
                value={totalHours}
                subtitle="total"
                icon="⏰"
                color={colors.primary}
              />
            </View>

            {/* Learning Progress */}
            <ProgressCard
              title="Progress"
              subtitle="Keep going!"
              progress={75}
              icon="📚"
              color={colors.primary}
            />

            {/* Weekly Overview */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              marginBottom: spacing['2xl'],
              ...shadows.md,
            }}>
              <View style={{ marginBottom: spacing.lg }}>
                <Text variant="subtitle" color="default">
                  📊 Week
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="title" color="default">{thisWeekChallenges}</Text>
                  <Text color="muted">Challenges</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="title" color="default">5</Text>
                  <Text color="muted">Days Active</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="title" color="default">8h</Text>
                  <Text color="muted">Time Spent</Text>
                </View>
              </View>

              {/* Weekly Chart Placeholder */}
              <View style={{
                height: 60,
                backgroundColor: colors.surfaceSecondary,
                borderRadius: borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text color="muted">Weekly activity chart</Text>
              </View>
            </View>

            {/* Achievements Section */}
            <View style={{ marginBottom: spacing['2xl'] }}>
              <View style={{ marginBottom: spacing.lg }}>
                <Text variant="subtitle" color="default">
                  🏆 Badges
                </Text>
              </View>
              
              <AchievementCard
                title="First"
                description="Complete first challenge"
                icon="🎯"
                isUnlocked={true}
              />
              
              <AchievementCard
                title="Week"
                description="7 days in a row"
                icon="🔥"
                isUnlocked={true}
              />
              
              <AchievementCard
                title="Speed"
                description="10 quick challenges"
                icon="⚡"
                isUnlocked={false}
                progress={7}
                maxProgress={10}
              />
              
              <AchievementCard
                title="Marathon"
                description="5 long challenges"
                icon="🏃‍♂️"
                isUnlocked={false}
                progress={2}
                maxProgress={5}
              />
            </View>

            {/* Learning Streaks */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              marginBottom: spacing['2xl'],
              ...shadows.md,
            }}>
              <View style={{ marginBottom: spacing.lg }}>
                <Text variant="subtitle" color="default">
                  🔥 Streaks
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text variant="title" color="default">{learningStreak}</Text>
                  <Text color="muted">Best</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="title" color="default">{currentStreak}</Text>
                  <Text color="muted">Current</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="title" color="default">23</Text>
                  <Text color="muted">Total</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    </Screen>
  );
}


