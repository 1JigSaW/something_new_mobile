import React from 'react';
import { Pressable, View } from 'react-native';

type IconButtonProps = {
  icon: React.ReactNode,
  onPress: () => void,
};

export default function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <Pressable onPress={onPress} className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
      <View>{icon}</View>
    </Pressable>
  );
}


