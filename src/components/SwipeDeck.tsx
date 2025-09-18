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
  onAddToFavorites?: (challenge: Challenge) => void;
  disabled?: boolean;
  swipeCount?: number;
  maxSwipes?: number;
  onUpgradePremium?: () => void;
  isPremium?: boolean;
  isSelected?: (challengeId: number) => boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.5; // Even higher threshold for better visibility

export function SwipeDeck({ 
  challenges, 
  onSwipeRight, 
  onSwipeLeft, 
  onSwipe, 
  onAddToFavorites,
  disabled = false, 
  swipeCount = 0, 
  maxSwipes = 5,
  onUpgradePremium,
  isPremium = false,
  isSelected
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNewCard, setIsNewCard] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const newCardOpacity = useRef(new Animated.Value(0)).current;
  const newCardScale = useRef(new Animated.Value(0.8)).current;

  // Reset index when challenges array changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsNewCard(false);
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
    newCardOpacity.setValue(0);
    newCardScale.setValue(0.8);
  }, [challenges]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  // Enhanced rotation and scale during swipe
  const rotateInterpolate = translateX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ['-0.3rad', '0rad', '0.3rad'],
    extrapolate: 'clamp',
  });

  const scaleInterpolate = translateX.interpolate({
    inputRange: [-screenWidth * 0.3, 0, screenWidth * 0.3],
    outputRange: [0.95, 1, 0.95],
    extrapolate: 'clamp',
  });


  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (disabled) return;

    const { translationX, translationY, state } = event.nativeEvent;

    if (state === 5) { // END
      const absTranslationX = Math.abs(translationX);
      const absTranslationY = Math.abs(translationY);
      
      // Check if this was a swipe
      if (absTranslationX > SWIPE_THRESHOLD || absTranslationY > SWIPE_THRESHOLD) {
        const currentChallenge = challenges[currentIndex];
        
        // Start the dramatic exit animation immediately
        Animated.parallel([
          // Fly away with maximum visibility - much further
          Animated.timing(translateX, {
            toValue: translationX > 0 ? screenWidth * 6 : -screenWidth * 6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: translationY * 0.4 - 400,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: translationX > 0 ? 2.0 : -2.0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.05,
            duration: 300,
            useNativeDriver: true,
          }),
          // Fade out
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Call callbacks after animation starts
          if (translationX > 0) {
            onSwipeRight(currentChallenge);
          } else {
            onSwipeLeft(currentChallenge);
          }
          
          if (onSwipe) {
            onSwipe();
          }
          // Show new card animation
          setIsNewCard(true);
          newCardOpacity.setValue(0);
          newCardScale.setValue(0.8);
          
          // Animate new card appearance
          Animated.parallel([
            Animated.timing(newCardOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(newCardScale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Switch to new card
            setCurrentIndex(prev => prev + 1);
            setIsNewCard(false);
            
            // Reset animations for next card
            translateX.setValue(0);
            translateY.setValue(0);
            rotate.setValue(0);
            scale.setValue(1);
            opacity.setValue(1);
            newCardOpacity.setValue(0);
            newCardScale.setValue(0.8);
          });
        });
      } else {
        // Return card to place
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 150,
            friction: 8,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 150,
            friction: 8,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
            tension: 150,
            friction: 8,
          }),
        ]).start();
      }
    }
  };

  if (challenges.length === 0 || currentIndex >= challenges.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isPremium ? 'No new ideas available' : 'Cards finished!'}
        </Text>
        <Text style={styles.emptySubtext}>
          {isPremium 
            ? 'You\'ve seen all available ideas in this category. New ones will appear soon!' 
            : 'Upgrade to Premium for unlimited access to ideas'
          }
        </Text>
        {!isPremium && onUpgradePremium && (
          <TouchableOpacity 
            style={styles.premiumButton}
            onPress={onUpgradePremium}
          >
            <Text style={styles.premiumButtonText}>⭐ Buy Premium</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (disabled) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Swipe limit reached</Text>
        <Text style={styles.emptySubtext}>
          You've used {swipeCount}/{maxSwipes} swipes today. Upgrade to Premium for unlimited swipes.
        </Text>
      </View>
    );
  }

  const currentChallenge = challenges[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.swipeCounter}>
        <Text style={styles.swipeCounterText}>
          Swipes: {swipeCount}/{maxSwipes}
        </Text>
      </View>
      
      <View style={styles.cardContainer}>
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
                { scale: scaleInterpolate },
              ],
              opacity: opacity,
            },
          ]}
        >
          {/* Heart button in top-right corner */}
          {onAddToFavorites && (
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => onAddToFavorites(currentChallenge)}
              activeOpacity={0.7}
            >
              <Text style={styles.heartIcon}>❤️</Text>
            </TouchableOpacity>
          )}

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

            {isSelected && isSelected(currentChallenge.id) && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedText}>✓ SELECTED</Text>
              </View>
            )}
          </View>

          {/* Swipe direction indicators */}
          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.leftIndicator,
              {
                opacity: translateX.interpolate({
                  inputRange: [-screenWidth * 0.3, 0],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <Text style={styles.indicatorText}>SKIP</Text>
          </Animated.View>
          
          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.rightIndicator,
              {
                opacity: translateX.interpolate({
                  inputRange: [0, screenWidth * 0.3],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <Text style={styles.indicatorText}>CHOOSE</Text>
          </Animated.View>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              ← Skip • Choose →
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
      
      {/* New card appearing animation */}
      {isNewCard && (
        <Animated.View
          style={[
            styles.card,
            styles.newCard,
            {
              opacity: newCardOpacity,
              transform: [{ scale: newCardScale }],
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.title}>Loading...</Text>
            <Text style={styles.description}>Getting your next challenge...</Text>
          </View>
        </Animated.View>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    paddingBottom: 150,
  },
  cardContainer: {
    top: 30,
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'visible',
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
    height: 500,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 20,
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
  selectedBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    transform: [{ translateY: -20 }],
  },
  leftIndicator: {
    left: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
  },
  rightIndicator: {
    right: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.9)',
  },
  indicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heartButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  heartIcon: {
    fontSize: 20,
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
  newCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
