import AsyncStorage from '@react-native-async-storage/async-storage';

async function forceClearAll() {
  try {
    console.log('🔥 FORCE CLEARING ALL DATA...');
    
    // Get all keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📋 Found keys:', allKeys);
    
    // Remove all keys
    await AsyncStorage.multiRemove(allKeys);
    console.log('✅ ALL DATA CLEARED!');
    
    // Also clear any cached data
    console.log('🔄 Clearing caches...');
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Make it available globally
global.forceClearAll = forceClearAll;

console.log('🚀 Force clear script loaded! Call forceClearAll() to reset everything');
