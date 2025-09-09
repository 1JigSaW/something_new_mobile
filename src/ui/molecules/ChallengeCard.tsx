import React from 'react';
import { View } from 'react-native';
import Card from '../atoms/Card';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Tag from '../atoms/Tag';

type ChallengeCardProps = {
  title: string,
  size: 'small' | 'medium' | 'large',
  onStart: () => void,
  onAdd: () => void,
  onDetails?: () => void,
};

export default function ChallengeCard({
  title,
  size,
  onStart,
  onAdd,
  onDetails,
}: ChallengeCardProps) {
  return (
    <Card className="mb-3">
      <Text variant="subtitle">{title}</Text>
      <View className="mt-2 flex-row items-center space-x-2">
        <Tag label={size} />
      </View>
      <View className="mt-4 flex-row space-x-2">
        <Button title="Start" onPress={onStart} />
        <Button title="Add to Plan" variant="secondary" onPress={onAdd} />
        {onDetails ? (
          <Button title="Details" variant="ghost" onPress={onDetails} />
        ) : null}
      </View>
    </Card>
  );
}


