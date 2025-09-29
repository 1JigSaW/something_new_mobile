import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../atoms/Text';

type SectionHeaderProps = {
  title: string,
  action?: React.ReactNode,
  style?: any,
};

export default function SectionHeader({
  title,
  action,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text variant="subtitle">{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});


