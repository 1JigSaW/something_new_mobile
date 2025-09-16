const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearViewedCards() {
  try {
    console.log('🧹 Clearing viewed cards...');
    
    // Clear viewed challenges
    await AsyncStorage.removeItem('viewedChallenges');
    console.log('✅ Viewed challenges cleared');
    
    // Also clear other test data if needed
    await AsyncStorage.removeItem('lastCompletedDate');
    console.log('✅ Last completed date cleared');
    
    await AsyncStorage.removeItem('appData');
    console.log('✅ App data cleared');
    
    console.log('🎉 All test data cleared! App will reset on next launch.');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Run the script
clearViewedCards();
