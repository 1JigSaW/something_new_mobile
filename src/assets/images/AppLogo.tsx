import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 24, 
  color = '#8b5cf6',
  backgroundColor = 'transparent'
}) => {
  return (
    <View style={{ width: size, height: size, backgroundColor }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Основная форма пазла - квадрат с выступами и углублениями */}
        <Path
          d="M4 4h8v4h4v8h-4v4H4v-8h4v-4H4V4z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Выступ справа (полукруглый) */}
        <Path
          d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Углубление снизу (полукруглое) */}
        <Path
          d="M10 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export default AppLogo;
