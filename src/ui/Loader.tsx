import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Text from './atoms/Text';

type LoaderProps = {
  label?: string,
};

export default function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    <View className="w-full items-center justify-center py-6">
      <ActivityIndicator color={colors.primary} />
      <Text color="muted" className="mt-2">{label}</Text>
    </View>
  );
}


