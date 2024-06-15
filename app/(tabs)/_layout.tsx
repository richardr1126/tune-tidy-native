import { Tabs } from 'expo-router';

//icons
import { Edit } from '~/lib/icons/Edit';
import { Flame } from '~/lib/icons/Flame';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(playlist)"
        options={{
          title: 'Sorter',
          tabBarIcon: () => <Edit className='color-primary' />,
        }}
      />
      <Tabs.Screen
        name="(stats)"
        options={{
          title: 'Stats',
          tabBarIcon: () => <Flame className='color-primary' />,
        }}
      />
    </Tabs>
  );
}