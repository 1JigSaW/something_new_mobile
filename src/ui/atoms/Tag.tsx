import React from 'react';
import { View } from 'react-native';
import Text from './Text';

type TagProps = {
  label: string,
};

export default function Tag({ label }: TagProps) {
  return (
    <View className="px-2 py-1 rounded-full bg-gray-100">
      <Text variant="caption" color="muted">{label}</Text>
    </View>
  );
}


