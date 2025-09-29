import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../styles';

type ContainerProps = {
  style?: any,
};

export default function Container({
  children,
  style,
}: PropsWithChildren<ContainerProps>) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
});


