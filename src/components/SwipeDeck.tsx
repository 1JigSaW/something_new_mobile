import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import UIButton from '../ui/atoms/Button';
import SwipeHints from '../ui/molecules/SwipeHints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { HeartIcon } from '../assets/icons';
import { colors } from '../styles';

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
  onReset?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.5;

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
  isSelected,
  onReset
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingChallenge, setPendingChallenge] = useState<Challenge | null>(null);
  const [isStopped, setIsStopped] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);
  const [internalSwipeCount, setInternalSwipeCount] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    setCurrentIndex(0);
    setPendingChallenge(null);
    setIsStopped(false);
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
    heartScale.setValue(1);
  }, [challenges, heartScale, opacity, rotate, scale, translateX, translateY]);

  const getTodayKey = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `pending_challenge:${yyyy}-${mm}-${dd}`;
  };

  const getCompletedKey = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `completed_today:${yyyy}-${mm}-${dd}`;
  };

  const loadPendingFromStorage = async () => {
    try {
      const key = getTodayKey();
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const parsed: Challenge = JSON.parse(raw);
        setPendingChallenge(parsed);
        buttonsOpacity.setValue(1);
      }
    } catch {}
  };

  const loadCompletedFromStorage = async () => {
    try {
      const key = getCompletedKey();
      const raw = await AsyncStorage.getItem(key);
      if (raw === 'true') {
        setCompletedToday(true);
      }
    } catch {}
  };

  const savePendingToStorage = async (challenge: Challenge | null) => {
    try {
      const key = getTodayKey();
      if (challenge) {
        await AsyncStorage.setItem(key, JSON.stringify(challenge));
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {}
  };

  const saveCompletedToStorage = async (value: boolean) => {
    try {
      const key = getCompletedKey();
      if (value) {
        await AsyncStorage.setItem(key, 'true');
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {}
  };

  useEffect(() => {
    loadPendingFromStorage();
    loadCompletedFromStorage();
  }, [loadCompletedFromStorage, loadPendingFromStorage]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

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
    if (disabled || isStopped || pendingChallenge || completedToday) return;
  
    const { translationX, state } = event.nativeEvent;
    if (state === (State as any).END || state === 5) {
      const currentChallenge = challenges[currentIndex];
  
      if (translationX < -SWIPE_THRESHOLD) {
        Animated.timing(translateX, {
          toValue: -screenWidth * 2,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onSwipeLeft(currentChallenge);
          onSwipe?.();
          setInternalSwipeCount(prev => prev + 1);
          setCurrentIndex(prev => prev + 1);
          translateX.setValue(0);
          translateY.setValue(0);
          opacity.setValue(1);
        });
      } else if (translationX > SWIPE_THRESHOLD) {
        Animated.parallel([
          Animated.timing(translateX, { toValue: screenWidth * 1.5, duration: 220, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: 0.6, duration: 220, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start(() => {
          setPendingChallenge(currentChallenge);
          savePendingToStorage(currentChallenge);
          onSwipe?.();
          setInternalSwipeCount(prev => prev + 1);
          translateX.setValue(0);
          translateY.setValue(0);
          rotate.setValue(0);
          opacity.setValue(1);
          scale.setValue(0.9);
          Animated.sequence([
            Animated.spring(scale, { toValue: 1, tension: 120, friction: 10, useNativeDriver: true }),
            Animated.timing(buttonsOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
          ]).start();
        });
       } else {
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 150, friction: 8 }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 150, friction: 8 }),
          Animated.spring(rotate, { toValue: 0, useNativeDriver: true, tension: 150, friction: 8 }),
        ]).start(() => {
          setPendingChallenge(null);
          buttonsOpacity.setValue(0);
        });
      }
    }
  };
  

  const handleAddToFavorites = (challenge: Challenge) => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onAddToFavorites?.(challenge);
  };

  const handleConfirm = () => {
    if (!pendingChallenge) return;
    onSwipeRight(pendingChallenge);
    onSwipe?.();
    setPendingChallenge(null);
    savePendingToStorage(null);
    setCompletedToday(true);
    saveCompletedToStorage(true);
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
    setCurrentIndex(challenges.length);
  };

  const handleSkip = () => {
    if (!pendingChallenge) return;
    onSwipeLeft(pendingChallenge);
    onSwipe?.();
    setPendingChallenge(null);
    savePendingToStorage(null);
    setCurrentIndex(prev => prev + 1);
  };

  const handleReset = async () => {
    await savePendingToStorage(null);
    await saveCompletedToStorage(false);
    setPendingChallenge(null);
    setCompletedToday(false);
    setCurrentIndex(0);
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
    buttonsOpacity.setValue(0);
    onReset?.();
  };

// removed custom stopped screen: we route to the standard finished state after Complete

  if (completedToday || challenges.length === 0 || currentIndex >= challenges.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {completedToday ? 'All done for today!' : 'Cards finished!'}
        </Text>
        <Text style={styles.emptySubtext}>
          {completedToday 
            ? 'Come back tomorrow for a new challenge.'
            : 'You\'ve seen all available ideas here.'}
        </Text>
        <View style={styles.buttonContainer}>
          {onReset && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetIcon}>🔄</Text>
              <Text style={styles.resetButtonText}>Reset Today</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const currentChallenge = challenges[currentIndex];
  const displayedChallenge = pendingChallenge || currentChallenge;

  return (
    <View style={styles.container}>
      {!pendingChallenge && (
        <View style={styles.swipeCounter}>
          <Text style={styles.swipeCounterText}>
            Swipes: {internalSwipeCount}/{maxSwipes}
          </Text>
        </View>
      )}

      <View style={styles.cardContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          enabled={!disabled && !pendingChallenge}
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
                  { scale },
                ],
                opacity: opacity,
                borderWidth: pendingChallenge ? 3 : 0,
                borderColor: pendingChallenge ? colors.surface : 'transparent',
                backgroundColor: pendingChallenge ? colors.primaryLight : colors.primary,
              },
            ]}
          >
            {onAddToFavorites && (
              <Animated.View
                style={[styles.heartButton, { transform: [{ scale: heartScale }] }]}
              >
                <TouchableOpacity
                  style={styles.heartButtonInner}
                  onPress={() => handleAddToFavorites(displayedChallenge)}
                  activeOpacity={0.7}
                >
                  <HeartIcon size={20} color={colors.error} filled={false} />
                </TouchableOpacity>
              </Animated.View>
            )}

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                {displayedChallenge.is_premium_only && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>⭐ PREMIUM</Text>
                  </View>
                )}
                {isSelected && isSelected(displayedChallenge.id) && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedText}>✓ SELECTED</Text>
                  </View>
                )}
              </View>

              <View style={styles.mainContent}>
                <Text style={styles.title}>{displayedChallenge.title}</Text>
                <Text style={styles.description}>{displayedChallenge.short_description}</Text>
              </View>

              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <View style={styles.metaIconContainer}>
                    <Text style={styles.metaIcon}>⏱️</Text>
                  </View>
                  <Text style={styles.metaText}>
                    {displayedChallenge.estimated_duration_min
                      ? `${displayedChallenge.estimated_duration_min} min`
                      : displayedChallenge.size === 'small'
                      ? '5-30 min'
                      : displayedChallenge.size === 'medium'
                      ? '30-90 min'
                      : '2h+'}
                  </Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <View style={styles.metaIconContainer}>
                    <Text style={styles.metaIcon}>📂</Text>
                  </View>
                  <Text style={styles.metaText}>{displayedChallenge.category}</Text>
                </View>
              </View>
              {pendingChallenge && (
                <Animated.View style={[styles.actions, { opacity: buttonsOpacity }]}>
                  <UIButton title="Skip" onPress={handleSkip} variant="secondary" style={styles.uiButtonLeft} />
                  <UIButton title="Complete" onPress={handleConfirm} variant="success" style={styles.uiButtonRight} />
                </Animated.View>
              )}

              {!pendingChallenge && (
                <SwipeHints leftLabel="Select" rightLabel="Skip" style={{ paddingBottom: 4 }} />
              )}

            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* actions already rendered above when pendingChallenge */}
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
    backgroundColor: colors.overlayDarker,
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
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: colors.shadow,
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
    padding: 28,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 17,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  metaContainer: {
    backgroundColor: colors.surfaceTint15,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  metaIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceTint20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.surfaceTint30,
    marginHorizontal: 16,
  },
  premiumBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  selectedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
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
    backgroundColor: colors.error,
  },
  rightIndicator: {
    right: 20,
    backgroundColor: colors.success,
  },
  indicatorText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heartButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
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
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  premiumButtonText: {
    color: colors.surface,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlayDarker,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedContent: {
    backgroundColor: colors.overlayLight,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resetIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  uiButtonLeft: { flex: 1, marginRight: 8 },
  uiButtonRight: { flex: 1, marginLeft: 8 },
  
});
