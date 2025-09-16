import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

interface Challenge {
  id: number;
  title: string;
  short_description: string;
  category: string;
  tags: string;
  size: 'small' | 'medium' | 'large';
  estimated_duration_min: number;
  is_premium_only: boolean;
  created_at: string;
  updated_at: string;
}

interface SwipeDeckProps {
  challenges: Challenge[];
  onSwipeRight: (challenge: Challenge) => void;
  onSwipeLeft: (challenge: Challenge) => void;
  onSwipe?: () => void;
  disabled?: boolean;
  swipeCount?: number;
  maxSwipes?: number;
  onUpgradePremium?: () => void;
  isPremium?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

export function SwipeDeck({ 
  challenges, 
  onSwipeRight, 
  onSwipeLeft, 
  onSwipe, 
  disabled = false, 
  swipeCount = 0, 
  maxSwipes = 5,
  onUpgradePremium,
  isPremium = false
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Сбрасываем индекс при изменении массива challenges
  useEffect(() => {
    setCurrentIndex(0);
    translateX.setValue(0);
    translateY.setValue(0);
    opacity.setValue(1);
  }, [challenges]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (disabled) return;

    const { translationX, translationY, velocityX, state } = event.nativeEvent;

    if (state === 5) { // END
      const absTranslationX = Math.abs(translationX);
      const absTranslationY = Math.abs(translationY);
      
      // Проверяем, был ли это свайп
      if (absTranslationX > SWIPE_THRESHOLD || absTranslationY > SWIPE_THRESHOLD) {
        const currentChallenge = challenges[currentIndex];
        
        if (translationX > 0) {
          // Свайп вправо - выбор
          onSwipeRight(currentChallenge);
        } else {
          // Свайп влево - пропуск
          onSwipeLeft(currentChallenge);
        }
        
        // Увеличиваем счетчик свайпов
        if (onSwipe) {
          onSwipe();
        }
        
        // Анимация исчезновения
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: translationX > 0 ? screenWidth : -screenWidth,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: translationY,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // После анимации переходим к следующей карточке
          setCurrentIndex(prev => prev + 1);
          // Сбрасываем анимации для следующей карточки
          translateX.setValue(0);
          translateY.setValue(0);
          opacity.setValue(1);
        });
      } else {
        // Возвращаем карточку на место
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  if (challenges.length === 0 || currentIndex >= challenges.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isPremium ? 'Нет доступных идей' : 'Карточки закончились!'}
        </Text>
        <Text style={styles.emptySubtext}>
          {isPremium 
            ? 'Попробуйте обновить или выберите другую категорию' 
            : 'Обновитесь до Premium для безлимитного доступа к идеям'
          }
        </Text>
        {!isPremium && onUpgradePremium && (
          <TouchableOpacity 
            style={styles.premiumButton}
            onPress={onUpgradePremium}
          >
            <Text style={styles.premiumButtonText}>⭐ Купить Premium</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (disabled) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Лимит свайпов достигнут</Text>
        <Text style={styles.emptySubtext}>
          Вы использовали {swipeCount}/{maxSwipes} свайпов сегодня. Обновитесь до Premium для безлимитных свайпов.
        </Text>
      </View>
    );
  }

  const currentChallenge = challenges[currentIndex];

  const rotateInterpolate = translateX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.swipeCounter}>
        <Text style={styles.swipeCounterText}>
          Свайпы: {swipeCount}/{maxSwipes}
        </Text>
      </View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!disabled}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX },
                { translateY },
                { rotate: rotateInterpolate },
              ],
              opacity,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.title}>{currentChallenge.title}</Text>
            <Text style={styles.description}>{currentChallenge.short_description}</Text>
            
            <View style={styles.meta}>
              <Text style={styles.time}>
                ⏱️ {currentChallenge.estimated_duration_min ? 
                  `${currentChallenge.estimated_duration_min}m` : 
                  currentChallenge.size === 'small' ? '5-30m' : 
                  currentChallenge.size === 'medium' ? '30-90m' : '2h+'}
              </Text>
              <Text style={styles.category}>• {currentChallenge.category}</Text>
            </View>

            {currentChallenge.is_premium_only && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            )}
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              ← Пропустить • Выбрать →
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  swipeCounter: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 10,
  },
  swipeCounterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    width: screenWidth - 40,
    height: 400,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: 'white',
    marginRight: 12,
  },
  category: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  instructions: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  premiumButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
