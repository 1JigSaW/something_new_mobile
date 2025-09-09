import React from 'react';
import { View } from 'react-native';
import Text from './atoms/Text';

type EmptyProps = {
  title?: string,
  subtitle?: string,
};

export default function Empty({
  title = 'Nothing here yet',
  subtitle = 'Try adjusting filters or come back later.',
}: EmptyProps) {
  return (
    <View className="w-full items-center justify-center py-10">
      <Text variant="subtitle">{title}</Text>
      <Text color="muted" className="mt-1">{subtitle}</Text>
    </View>
  );
}


