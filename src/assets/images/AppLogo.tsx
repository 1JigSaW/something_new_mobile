import React from 'react';
import { View, Image, ImageStyle } from 'react-native';

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
      borderRadius: size / 8, // Небольшое скругление
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
