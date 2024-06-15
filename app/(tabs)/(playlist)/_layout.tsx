import { Stack } from 'expo-router';
import { PlaylistsProvider } from '~/contexts/PlaylistsContext';

export default function PlaylistLayout() {
  return (
    <PlaylistsProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            title: 'Sorter',
            headerShown: false,
            //headerRight: () => <ThemeToggle />,
          }}
        />
      </Stack>
    </PlaylistsProvider>
  );
}
