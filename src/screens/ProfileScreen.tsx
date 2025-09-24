import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Switch, Alert, Dimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useProgressStats } from '../features/progress/useProgressStats';
import PageHeader from '../ui/layout/PageHeader';
import Section from '../ui/layout/Section';
import { colors } from '../styles/colors';
import WeeklyBarChart from '../ui/molecules/WeeklyBarChart';
import StatCard from '../ui/molecules/StatCard';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const {
    streak,
    completedCount,
    resetToNewDay,
  } = useApp();

  const { signOut, user } = useAuth();

  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [progressData, setProgressData] = useState<Array<{
    date: string;
    day: string;
    completed: number;
    streak: number;
  }>>([]);

  const { data: progressStats } = useProgressStats();

  useEffect(() => {
    if (progressStats) {
      const data = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayStats = progressStats.daily_stats?.find((stat: any) => stat.date === dateStr) || { completed: 0 };
        
        data.push({
          date: dateStr,
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          completed: dayStats.completed || 0,
          streak: i === 0 ? streak : Math.max(0, streak - i),
        });
      }
      
      setProgressData(data);
    }
  }, [progressStats, streak]);

  const generateCalendarData = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push({ day: '', completed: false, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate();
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      
      const dayStats = progressStats?.daily_stats?.find((stat: any) => stat.date === dateStr);
      const completed = dayStats ? dayStats.completed > 0 : false;
      
      calendar.push({
        day: day.toString(),
        completed,
        isCurrentMonth: true,
        isToday,
      });
    }
    
    return calendar;
  };


  const getStreakMessage = () => {
    if (streak === 0) return 'Start your journey!';
    if (streak < 7) return 'Great start!';
    if (streak < 30) return 'Excellent habit!';
    if (streak < 100) return 'Incredible!';
    return 'Legend! 🔥';
  };

  const getCompletedMessage = () => {
    if (completedCount === 0) return 'First step ahead';
    if (completedCount < 10) return 'Great start!';
    if (completedCount < 50) return 'You\'re on the right track!';
    if (completedCount < 100) return 'Impressive!';
    return 'Incredible achievements!';
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              console.log('User logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const calendarData = generateCalendarData();

  if (!progressStats) {
    return (
      <View style={styles.container}>
        <PageHeader title="Profile" subtitle="Your progress and statistics" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress data...</Text>
        </View>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <PageHeader
        title="Profile"
        subtitle="Your progress and statistics"
        right={(
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={async () => {
                Alert.alert(
                  'Reset All Data',
                  'Reset all progress and data? This cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Reset', 
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await resetToNewDay();
                          Alert.alert('Success!', 'All data has been reset.');
                        } catch (error) {
                          Alert.alert('Error', 'Reset failed: ' + (error instanceof Error ? error.message : String(error)));
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.resetIcon}>🔄</Text>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Section title="Progress Overview">
          <View style={styles.statsGrid}>
            <StatCard value={progressStats?.streak || streak} label="Day Streak" message={getStreakMessage()} />
            <StatCard value={progressStats?.total_completed || completedCount} label="Completed" message={getCompletedMessage()} style={{ marginLeft: 12 }} />
          </View>
        </Section>

        <Section title="Weekly Progress">
          <WeeklyBarChart items={progressData} />
        </Section>

        <Section title="Activity Calendar" style={styles.lastSection}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.monthYear}>
                {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            
            <View style={styles.calendarGrid}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekdayLabel}>{day}</Text>
              ))}
              
              {calendarData.map((day, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.calendarDay,
                    day.isToday && styles.today,
                    day.completed && styles.completedDay,
                    !day.isCurrentMonth && styles.otherMonth
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    day.isToday && styles.todayText,
                    day.completed && styles.completedText,
                    !day.isCurrentMonth && styles.otherMonthText
                  ]}>
                    {day.day}
                  </Text>
                </View>
              ))}
            </View>
            
          </View>
        </Section>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  section: {
    marginBottom: 50,
  },
  lastSection: {
    marginBottom: 0,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chartSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  
  calendarContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: -20,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    paddingVertical: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  today: {
    backgroundColor: colors.primary,
  },
  completedDay: {
    backgroundColor: colors.success,
  },
  otherMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  todayText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  completedText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: colors.textMuted,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  resetButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});