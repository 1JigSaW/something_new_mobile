// Script to clear today's data from AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

async function clearTodayData() {
  try {
    // Clear today's completion status
    await AsyncStorage.removeItem('lastCompletedDate');
    
    // Clear today's challenges taken
    const appData = await AsyncStorage.getItem('appData');
    if (appData) {
      const parsed = JSON.parse(appData);
      parsed.completedToday = false;
      parsed.activeChallenge = null;
      parsed.challengesTakenToday = 0;
      parsed.skipsUsedToday = 0;
      parsed.swipesUsedToday = 0;
      await AsyncStorage.setItem('appData', JSON.stringify(parsed));
    }
    
    console.log('✅ Today\'s data cleared successfully!');
    console.log('You can now take new challenges today');
  } catch (error) {
    console.error('❌ Failed to clear today\'s data:', error);
  }
}

// Make it available globally for Metro console
global.clearTodayData = clearTodayData;

export default clearTodayData;
