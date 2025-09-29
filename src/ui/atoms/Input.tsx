import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import Text from './Text';
import { colors } from '../../styles';

type InputProps = TextInputProps & {
  label?: string,
  error?: string,
  containerClassName?: string,
};

export default function Input({
  label,
  error,
  containerClassName = '',
  ...rest
}: InputProps) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {label ? <Text className="mb-1">{label}</Text> : null}
      <TextInput
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-3 text-base"
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error ? (
        <Text color="error" className="mt-1">{error}</Text>
      ) : null}
    </View>
  );
}


