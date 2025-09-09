import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { spacing } from '../../styles';

type ContainerProps = {
  className?: string,
};

export default function Container({
  children,
  className = '',
}: PropsWithChildren<ContainerProps>) {
  return (
    <View style={{ width: '100%', paddingHorizontal: spacing.lg }}>
      {children}
    </View>
  );
}


