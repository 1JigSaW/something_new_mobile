import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, () => Promise<void>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
      try { console.log('[Storage] load', { key, hasValue: item !== null }); } catch {}
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = useCallback(async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      try { console.log('[Storage] set', { key, value }); } catch {}
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }, [key]);

  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
      try { console.log('[Storage] remove', { key }); } catch {}
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, isLoading];
}

export function useAsyncStorageArray<T>(
  key: string,
  initialValue: T[] = []
): [T[], (value: T[]) => Promise<void>, (item: T) => Promise<void>, (itemId: number | string, idField?: keyof T) => Promise<void>, boolean] {
  const [items, setItems, removeItems, isLoading] = useAsyncStorage<T[]>(key, initialValue);

  const addItem = useCallback(async (item: T) => {
    const newItems = [...items, item];
    await setItems(newItems);
  }, [items, setItems]);

  const removeItem = useCallback(async (itemId: number | string, idField: keyof T = 'id' as keyof T) => {
    const newItems = items.filter(item => item[idField] !== itemId);
    await setItems(newItems);
  }, [items, setItems]);

  return [items, setItems, addItem, removeItem, isLoading];
}

export function useAsyncStorageNumberArray(
  key: string,
  initialValue: number[] = []
): [number[], (value: number[]) => Promise<void>, (item: number) => Promise<void>, (itemId: number) => Promise<void>, boolean] {
  const [items, setItems, addItem, removeItem, isLoading] = useAsyncStorageArray<number>(key, initialValue);

  const addItemNumber = useCallback(async (item: number) => {
    if (!items.includes(item)) {
      await addItem(item);
    }
  }, [items, addItem]);

  const removeItemNumber = useCallback(async (itemId: number) => {
    await removeItem(itemId);
  }, [removeItem]);

  return [items, setItems, addItemNumber, removeItemNumber, isLoading];
}
