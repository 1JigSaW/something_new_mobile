// Reset today's data script
import AsyncStorage from '@react-native-async-storage/async-storage';

async function resetToday() {
  try {
    console.log('🔄 Resetting today\'s data...');
    
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
    }
    
    // Clear selected challenges
    await AsyncStorage.removeItem('selectedChallenges');
    
    console.log('✅ Today\'s data cleared successfully!');
    console.log('You can now take new challenges today');
    
    // Reload the app
    console.log('🔄 Reloading app...');
    
  } catch (error) {
    console.error('❌ Failed to reset today\'s data:', error);
  }
}

// Make it available globally
global.resetToday = resetToday;

export default resetToday;
