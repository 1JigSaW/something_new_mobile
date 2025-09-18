// Force reset all data - run this in Metro console
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function forceReset() {
  try {
    console.log('🔄 Force resetting ALL data...');
    
    // Clear everything
    await AsyncStorage.multiRemove([
      'lastCompletedDate',
      'appData', 
      'selectedChallenges',
      'viewedChallenges'
    ]);
    
    console.log('✅ All data cleared!');
    console.log('🔄 Please reload the app (shake device -> Reload)');
    
  } catch (error) {
    console.error('❌ Failed to force reset:', error);
  }
}

// Make it available globally
global.forceReset = forceReset;
global.clearAll = forceReset;
