import React from 'react';
import { Text } from 'react-native';
import { Home, Grid3X3, Heart, User } from 'lucide-react-native';

interface TabIconProps {
  name: string;
  color: string;
  size?: number;
  useLucide?: boolean;
}

const UNICODE_ICONS = {
  Today: '●',
  Categories: '■',
  Favorites: '★',
  Profile: '○',
};

export function TabIcon({ name, color, size = 24, useLucide = true }: TabIconProps) {
  if (useLucide) {
    switch (name) {
      case 'Today':
        return <Home size={size} color={color} />;
      case 'Categories':
        return <Grid3X3 size={size} color={color} />;
      case 'Favorites':
        return <Heart size={size} color={color} />;
      case 'Profile':
        return <User size={size} color={color} />;
      default:
        return null;
    }
  }

  const icon = UNICODE_ICONS[name as keyof typeof UNICODE_ICONS];
  return (
    <Text style={{ fontSize: size, color, fontWeight: 'bold' }}>
      {icon}
    </Text>
  );
}
