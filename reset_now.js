// Простой сброс данных
const AsyncStorage = require('@react-native-async-storage/async-storage');

async function resetNow() {
  try {
    console.log('🔄 СБРАСЫВАЮ ВСЕ ДАННЫЕ...');
    
    // Очищаем все ключи по одному
    await AsyncStorage.removeItem('lastCompletedDate');
    await AsyncStorage.removeItem('appData');
    await AsyncStorage.removeItem('selectedChallenges');
    await AsyncStorage.removeItem('viewedChallenges');
    
    console.log('✅ ВСЕ ДАННЫЕ ОЧИЩЕНЫ!');
    console.log('🎉 Теперь можешь свайпать!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// Запускаем сразу
resetNow();
