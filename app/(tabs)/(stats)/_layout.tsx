import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  useTheme,
  type ParamListBase,
  type TabNavigationState,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { StatsProvider } from '~/contexts/StatsContext';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function MaterialTopTabsLayout() {
  const { colors } = useTheme();
  return (
    <StatsProvider>
      <MaterialTopTabs
        initialRouteName='artists'
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: {
            marginTop: 50,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: 'capitalize',
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 'auto', minWidth: 100 },
        }}
      >
        <MaterialTopTabs.Screen
          name='artists'
          options={{
            title: 'Top Artists',
          }}
        />
        <MaterialTopTabs.Screen
          name='tracks'
          options={{
            title: 'Top Tracks',

          }}
        />
        <MaterialTopTabs.Screen
          name='albums'
          options={{
            title: 'Top Albums',
          }}
        />

      </MaterialTopTabs>
    </StatsProvider>
  );
}