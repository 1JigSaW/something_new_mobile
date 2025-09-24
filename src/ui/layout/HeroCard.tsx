import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import Text from '../atoms/Text';

type HeroCardProps = {
  title: string,
  subtitle?: string,
  className?: string,
};

export default function HeroCard({
  title,
  subtitle,
  className = '',
  children,
}: PropsWithChildren<HeroCardProps>) {
  return (
    <View style={{ 
      width: '100%', 
      borderRadius: 16, 
      padding: 20, 
      backgroundColor: colors.primary 
    }}>
      <Text variant="title">
        {title}
      </Text>
      {subtitle ? (
        <View style={{ marginTop: 4 }}>
          <Text color="muted">{subtitle}</Text>
        </View>
      ) : null}
      {children ? <View style={{ marginTop: 12 }}>{children}</View> : null}
    </View>
  );
}


