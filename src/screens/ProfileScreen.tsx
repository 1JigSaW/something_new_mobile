import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const {
    streak,
    completedCount,
    isPremium,
    setIsPremium,
    favorites,
    skipsUsedToday,
    maxSkipsPerDay,
  } = useApp();

  const handlePremiumToggle = () => {
    if (isPremium) {
      Alert.alert(
        'Отключить Premium?',
        'Вы уверены, что хотите отключить Premium подписку?',
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Отключить',
            style: 'destructive',
            onPress: () => setIsPremium(false),
          },
        ]
      );
    } else {
      Alert.alert(
        'Обновить до Premium',
        'Получите доступ к безлимитным функциям!',
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Обновить',
            onPress: () => setIsPremium(true),
          },
        ]
      );
    }
  };

  const getStreakMessage = () => {
    if (streak === 0) return 'Начните свой путь!';
    if (streak < 7) return 'Отличное начало!';
    if (streak < 30) return 'Отличная привычка!';
    if (streak < 100) return 'Невероятно!';
    return 'Легенда! 🔥';
  };

  const getCompletedMessage = () => {
    if (completedCount === 0) return 'Первый шаг впереди';
    if (completedCount < 10) return 'Отличное начало!';
    if (completedCount < 50) return 'Вы на правильном пути!';
    if (completedCount < 100) return 'Впечатляюще!';
    return 'Невероятные достижения!';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.subtitle}>Ваша статистика и настройки</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Premium статус */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Premium</Text>
            <View style={[styles.premiumBadge, isPremium && styles.premiumBadgeActive]}>
              <Text style={[styles.premiumText, isPremium && styles.premiumTextActive]}>
                {isPremium ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>
          
          <View style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>
              {isPremium ? 'Premium активен' : 'Обновитесь до Premium'}
            </Text>
            <Text style={styles.premiumDescription}>
              {isPremium 
                ? 'Вы получаете все премиум функции'
                : 'Получите безлимитные свайпы, пропуски и сохранения'
              }
            </Text>
            
            <View style={styles.premiumFeatures}>
              <Text style={styles.featureText}>✅ Безлимитные свайпы</Text>
              <Text style={styles.featureText}>✅ Несколько идей в день</Text>
              <Text style={styles.featureText}>✅ Безлимитные пропуски</Text>
              <Text style={styles.featureText}>✅ Безлимитное избранное</Text>
            </View>

            <TouchableOpacity 
              style={[styles.premiumButton, isPremium && styles.premiumButtonActive]}
              onPress={handlePremiumToggle}
            >
              <Text style={[styles.premiumButtonText, isPremium && styles.premiumButtonTextActive]}>
                {isPremium ? 'Управление подпиской' : 'Обновить до Premium'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Статистика */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Дней подряд</Text>
              <Text style={styles.statMessage}>{getStreakMessage()}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Выполнено</Text>
              <Text style={styles.statMessage}>{getCompletedMessage()}</Text>
            </View>
          </View>

          <View style={styles.dailyStats}>
            <Text style={styles.dailyStatsTitle}>Сегодня</Text>
            <View style={styles.dailyStatsRow}>
              <Text style={styles.dailyStatsText}>
                Пропусков: {skipsUsedToday}/{maxSkipsPerDay}
              </Text>
              <Text style={styles.dailyStatsText}>
                Избранное: {favorites.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Настройки</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Уведомления</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: '#8B5CF6' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Темная тема</Text>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: '#8B5CF6' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Язык</Text>
            <Text style={styles.settingValue}>Русский</Text>
          </View>
        </View>

        {/* О приложении */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>Something New</Text>
            <Text style={styles.aboutVersion}>Версия 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Приложение помогает вам каждый день пробовать что-то новое и строить привычку открытости к новому опыту.
            </Text>
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
    padding: 20,
  },
  section: {
    marginBottom: 32,
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
  },
  premiumBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeActive: {
    backgroundColor: '#FFD700',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  premiumTextActive: {
    color: '#8B5CF6',
  },
  premiumCard: {
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
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  premiumFeatures: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  premiumButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumButtonActive: {
    backgroundColor: '#e0e0e0',
  },
  premiumButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumButtonTextActive: {
    color: '#666',
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
  dailyStats: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  dailyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyStatsText: {
    fontSize: 14,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 1,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  aboutCard: {
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
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});