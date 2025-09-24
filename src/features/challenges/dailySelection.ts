import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTodayKey = (prefix: string) => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${prefix}:${yyyy}-${mm}-${dd}`;
};

export async function loadPending<T>(): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(getTodayKey('pending_challenge'));
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

export async function savePending<T>(value: T | null): Promise<void> {
  try {
    const key = getTodayKey('pending_challenge');
    if (value) await AsyncStorage.setItem(key, JSON.stringify(value));
    else await AsyncStorage.removeItem(key);
  } catch {}
}

export async function loadCompletedFlag(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(getTodayKey('completed_today'));
    return raw === 'true';
  } catch {
    return false;
  }
}

export async function saveCompletedFlag(value: boolean): Promise<void> {
  try {
    const key = getTodayKey('completed_today');
    if (value) await AsyncStorage.setItem(key, 'true');
    else await AsyncStorage.removeItem(key);
  } catch {}
}


