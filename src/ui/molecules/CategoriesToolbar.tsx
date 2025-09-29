import React from 'react';
import { View, TouchableOpacity, Text as RNText } from 'react-native';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import { colors, spacing, borderRadius } from '../../styles';

type CategoriesToolbarProps = {
  selectedSize: string | null,
  onSelectSize: (size: string | null) => void,
  selectedDuration: string | null,
  onSelectDuration: (duration: string | null) => void,
  showPremiumOnly: boolean,
  onTogglePremium: () => void,
  onClear: () => void,
  isPremium: boolean,
};

export default function CategoriesToolbar({
  selectedSize,
  onSelectSize,
  selectedDuration,
  onSelectDuration,
  showPremiumOnly,
  onTogglePremium,
  onClear,
  isPremium,
}: CategoriesToolbarProps) {
  const sizeOptions = [
    { key: 'small', label: 'Small' },
    { key: 'medium', label: 'Medium' },
    { key: 'large', label: 'Large' },
  ];

  const durationOptions = [
    { key: 'quick', label: '≤30m' },
    { key: 'medium', label: '30-90m' },
    { key: 'long', label: '90m+' },
  ];

  return (
    <View style={{ gap: spacing.md }}>
      <View>
        <Text variant="subtitle" color="muted">Size</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.sm }}>
          {sizeOptions.map(option => (
            <Button
              key={option.key}
              title={option.label}
              onPress={() => onSelectSize(selectedSize === option.key ? null : option.key)}
              variant={selectedSize === option.key ? 'primary' : 'secondary'}
              style={{
                borderRadius: borderRadius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              }}
            />
          ))}
        </View>
      </View>

      <View>
        <Text variant="subtitle" color="muted">Duration</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.sm }}>
          {durationOptions.map(option => (
            <Button
              key={option.key}
              title={option.label}
              onPress={() => onSelectDuration(selectedDuration === option.key ? null : option.key)}
              variant={selectedDuration === option.key ? 'primary' : 'secondary'}
              style={{
                borderRadius: borderRadius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              }}
            />
          ))}
        </View>
      </View>

      {isPremium ? (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            title={showPremiumOnly ? 'Premium: On' : 'Premium: Off'}
            onPress={onTogglePremium}
            variant={showPremiumOnly ? 'primary' : 'secondary'}
            style={{
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          />
          <Button
            title="Clear"
            onPress={onClear}
            variant="ghost"
            style={{
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            title="Clear"
            onPress={onClear}
            variant="ghost"
            style={{
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          />
        </View>
      )}
    </View>
  );
}


