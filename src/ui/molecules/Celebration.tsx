import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../../styles';

type CelebrationProps = {
  visible: boolean,
};

const EMOJIS = ['🎉', '✨', '🎊', '⭐', '✅', '🍀', '💚'];
const { width, height } = Dimensions.get('window');

export default function Celebration({ visible }: CelebrationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const particles = useRef(
    Array.from({ length: 18 }).map((_v, i) => ({
      x: new Animated.Value(width / 2),
      y: new Animated.Value(height / 2 - 120),
      vy: Math.random() * 2 + 2,
      vx: (Math.random() - 0.5) * 4,
      r: Math.random() * 360,
      emoji: EMOJIS[i % EMOJIS.length],
      delay: Math.random() * 120,
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    scale.setValue(0.9);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    particles.forEach((p) => {
      p.x.setValue(width / 2);
      p.y.setValue(height / 2 - 120);
      Animated.sequence([
        Animated.delay(p.delay),
        Animated.parallel([
          Animated.timing(p.y, { toValue: height, duration: 900 + Math.random() * 400, useNativeDriver: true }),
          Animated.timing(p.x, { toValue: width / 2 + p.vx * 80, duration: 900, useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, [visible, opacity, scale, particles]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity, transform: [{ scale }] }]}>
      <Text style={styles.title}>Great!</Text>
      <Text style={styles.subtitle}>Challenge completed</Text>
      {particles.map((p, idx) => (
        <Animated.Text
          key={`p-${idx}`}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { rotate: `${p.r}deg` },
              ],
            },
          ]}
        >
          {p.emoji}
        </Animated.Text>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.success,
    zIndex: 1000,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.surface,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: colors.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 18,
  },
});


