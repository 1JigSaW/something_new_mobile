import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Today: undefined;
  Categories: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type TabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;

export const TAB_SCREENS = {
  TODAY: 'Today',
  CATEGORIES: 'Categories',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
} as const;

export type TabScreenName = typeof TAB_SCREENS[keyof typeof TAB_SCREENS];
