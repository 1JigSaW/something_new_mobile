// Clear Test Data Script for React Native
// Run this in Metro console or add to your app temporarily

import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAllTestData = async () => {
  try {
    console.log('🧹 Clearing all test data...');
    
    // Clear viewed challenges
    await AsyncStorage.removeItem('viewedChallenges');
    console.log('✅ Viewed challenges cleared');
    
    // Clear daily data
    await AsyncStorage.removeItem('lastCompletedDate');
    console.log('✅ Last completed date cleared');
    
    // Clear app data
    await AsyncStorage.removeItem('appData');
    console.log('✅ App data cleared');
    
    // Clear all AsyncStorage (nuclear option)
    // await AsyncStorage.clear();
    // console.log('✅ All AsyncStorage cleared');
    
    console.log('🎉 All test data cleared! Restart the app to see changes.');
    
    return true;
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return false;
  }
};

// For Metro console usage
if (typeof global !== 'undefined') {
  global.clearTestData = clearAllTestData;
  console.log('💡 Run clearTestData() in Metro console to clear all test data');
}
