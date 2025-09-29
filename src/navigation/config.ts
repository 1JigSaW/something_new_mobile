import { colors } from '../styles/colors';

export const TAB_BAR_CONFIG = {
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 0,
    paddingTop: 0,
    height: 45,
    marginBottom: 0,
    elevation: 0,
  },
  activeTintColor: colors.primary,
  inactiveTintColor: colors.textSecondary,
  headerShown: false,
  tabBarHideOnKeyboard: true,
};

export const TAB_ICONS = {
  TODAY: '●',
  CATEGORIES: '■',
  FAVORITES: '★',
  PROFILE: '○',
} as const;

export const TAB_LABELS = {
  TODAY: 'Today',
  CATEGORIES: 'Categories',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
} as const;
