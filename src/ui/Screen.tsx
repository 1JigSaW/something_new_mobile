import React, { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { colors } from '../styles';

interface ScreenProps {
  style?: any;
}

export default function Screen({
  children,
  style,
}: PropsWithChildren<ScreenProps>) {
  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={['top', 'bottom']}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});


