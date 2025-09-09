import React from 'react';
import { View } from 'react-native';
import Text from '../atoms/Text';

type SectionHeaderProps = {
  title: string,
  action?: React.ReactNode,
  className?: string,
};

export default function SectionHeader({
  title,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <View className={`w-full flex-row items-center justify-between ${className}`}>
      <Text variant="subtitle">{title}</Text>
      {action}
    </View>
  );
}


