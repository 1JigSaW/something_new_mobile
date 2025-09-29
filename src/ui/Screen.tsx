import React, { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles';

type ScreenProps = {
  className?: string,
};

export default function Screen({
  children,
}: PropsWithChildren<ScreenProps>) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'bottom']}
    >
      {children}
    </SafeAreaView>
  );
}


