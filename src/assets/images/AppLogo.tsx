import React from 'react';
import { View, Image, ImageStyle } from 'react-native';
import { colors } from '../../styles/colors';

interface AppLogoProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 24, 
  color = colors.primary,
  backgroundColor = 'transparent'
}) => {
  const imageStyle: ImageStyle = {
    width: size,
    height: size,
    resizeMode: 'contain',
  };

  return (
    <View style={{ 
      width: size, 
      height: size, 
      backgroundColor,
      borderRadius: size / 8,
      overflow: 'hidden',
    }}>
      <Image
        source={require('./logo.png')}
        style={imageStyle}
      />
    </View>
  );
};

export default AppLogo;
