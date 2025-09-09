import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TodayScreen from '../screens/TodayScreen';
import ChooseScreen from '../screens/ChooseScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { Home, List, BarChart3 } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function BottomTabNavigation() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#5566ff',
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ChooseScreen}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <List color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarLabel: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <BarChart3 color={color} size={size} />
            ),
          }}
        />

      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}

export default BottomTabNavigation;


