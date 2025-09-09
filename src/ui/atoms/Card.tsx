import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

type CardProps = {
  className?: string,
};

export default function Card({
  children,
  className = '',
}: PropsWithChildren<CardProps>) {
  const cls = `bg-white rounded-2xl p-4 shadow-md border border-gray-100 ${className}`;
  return <View className={cls}>{children}</View>;
}


