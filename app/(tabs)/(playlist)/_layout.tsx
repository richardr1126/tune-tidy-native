import { Stack } from 'expo-router';
import { PlaylistsProvider } from '~/contexts/PlaylistsContext';

export default function PlaylistLayout() {
  return (
    <PlaylistsProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            title: 'Select',
            headerShown: false,
            //headerRight: () => <ThemeToggle />,
          }}
        />
        <Stack.Screen
          name='[playlist]'
          options={{
            title: ' ',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBlurEffect: 'systemThinMaterial',
            //headerRight: () => <ThemeToggle />,
          }}
        />
      </Stack>
    </PlaylistsProvider>
  );
}
