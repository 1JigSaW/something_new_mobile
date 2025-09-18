import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Switch, Alert, Dimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { http } from '../api';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const {
    streak,
    completedCount,
    resetToNewDay,
  } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [progressData, setProgressData] = useState<Array<{
    date: string;
    day: string;
    completed: number;
    streak: number;
  }>>([]);

  // Fetch real progress data from API
  const { data: progressStats } = useQuery({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      try {
        const { data } = await http.get('/api/profile/stats/test');
        return data;
      } catch (error) {
        console.error('Profile stats API Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Generate real progress data from API
  useEffect(() => {
    if (progressStats) {
      const data = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Get completion data for this date from API
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

  // Generate calendar data for the current month with real data
  const generateCalendarData = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push({ day: '', completed: false, isCurrentMonth: false });
    }
    
    // Add days of the month with real completion data
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate();
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      
      // Get real completion data from API
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

  const calendarData = generateCalendarData();

  // Show loading state if data is not available
  if (!progressStats) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your progress and statistics</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your progress and statistics</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{progressStats?.streak || streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
            <Text style={styles.statMessage}>{getStreakMessage()}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{progressStats?.total_completed || completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statMessage}>{getCompletedMessage()}</Text>
          </View>
        </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {progressData.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: item.completed ? 60 : 20,
                        backgroundColor: item.completed ? '#4CAF50' : '#E0E0E0'
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.chartSubtitle}>Daily completion rate</Text>
          </View>
        </View>

        {/* Calendar View */}
        <View style={styles.lastSection}>
          <Text style={styles.sectionTitle}>Activity Calendar</Text>
          
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
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statMessage: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  // Chart styles
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
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
    color: '#666',
    fontWeight: '500',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  // Calendar styles
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
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
    color: '#333',
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
    color: '#666',
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
    backgroundColor: '#8B5CF6',
  },
  completedDay: {
    backgroundColor: '#4CAF50',
  },
  otherMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#999',
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});