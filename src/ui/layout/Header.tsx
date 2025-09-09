import React from 'react';
import { View } from 'react-native';
import Text from '../atoms/Text';
import { spacing } from '../../styles';

type HeaderProps = {
  title: string,
  subtitle?: string,
  right?: React.ReactNode,
  className?: string,
};

export default function Header({
  title,
  subtitle,
  right,
  className = '',
}: HeaderProps) {
  return (
    <View style={{ 
      width: '100%', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text
            variant="caption"
            color="muted"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}


