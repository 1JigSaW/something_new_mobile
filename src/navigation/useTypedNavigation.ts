import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '../types/navigation';

export function useTypedNavigation() {
  return useNavigation<any>(); // Используем any пока не настроим полную типизацию
}
