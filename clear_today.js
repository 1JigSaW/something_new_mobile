// Clear today's data - run this in Metro console
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearTodayData() {
  try {
    console.log('🔄 Clearing today\'s data...');
    
    // Clear today's completion status
    await AsyncStorage.removeItem('lastCompletedDate');
    
    // Get current app data
    const appData = await AsyncStorage.getItem('appData');
    if (appData) {
      const parsed = JSON.parse(appData);
      
      // Reset today's data
      parsed.completedToday = false;
      parsed.activeChallenge = null;
      parsed.challengesTakenToday = 0;
      parsed.skipsUsedToday = 0;
      parsed.swipesUsedToday = 0;
      
      // Save updated data
      await AsyncStorage.setItem('appData', JSON.stringify(parsed));
      console.log('✅ App data reset');
    }
    
    // Clear selected challenges
    await AsyncStorage.removeItem('selectedChallenges');
    console.log('✅ Selected challenges cleared');
    
    console.log('🎉 Today\'s data cleared successfully!');
    console.log('You can now take new challenges today');
    
  } catch (error) {
    console.error('❌ Failed to clear today\'s data:', error);
  }
}

// Make it available globally
global.clearTodayData = clearTodayData;

// Also add a simple reset command
global.resetLimits = clearTodayData;
