import { PortalHost } from '@rn-primitives/portal';
import { Tabs } from 'expo-router';

//icons
import { Edit } from '~/lib/icons/Edit';
import { Flame } from '~/lib/icons/Flame';
import { Settings } from "~/lib/icons/Settings";
import { cn } from '~/lib/utils';

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="(playlist)"
          options={{
            title: 'Sorter',
            tabBarIcon: ({ focused }) => <Edit className={focused ? 'color-primary' : 'color-[#777]'} />,
          }}
        />
        <Tabs.Screen
          name="(stats)"
          options={{
            title: 'Stats',
            tabBarIcon: ({ focused }) => <Flame className={focused ? 'color-primary' : 'color-[#777]'} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerShown: true,
            tabBarIcon: ({ focused }) => <Settings className={focused ? 'color-primary' : 'color-[#777]'} />,
          }}
        />
      </Tabs>
      <PortalHost />
    </>
  );
}