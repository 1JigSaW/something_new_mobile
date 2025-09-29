import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayScreen from '../screens/TodayScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TabIcon } from './TabIcon';
import { TAB_BAR_CONFIG, TAB_LABELS } from './config';
import { TAB_SCREENS, RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigation() {
  return (
    <Tab.Navigator screenOptions={TAB_BAR_CONFIG}>
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: TAB_LABELS.TODAY,
          tabBarIcon: ({ color }) => (
            <TabIcon name="Today" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: TAB_LABELS.CATEGORIES,
          tabBarIcon: ({ color }) => (
            <TabIcon name="Categories" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: TAB_LABELS.FAVORITES,
          tabBarIcon: ({ color }) => (
            <TabIcon name="Favorites" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: TAB_LABELS.PROFILE,
          tabBarIcon: ({ color }) => (
            <TabIcon name="Profile" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
