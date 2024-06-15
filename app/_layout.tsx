import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '~/components/primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useCustomColorScheme from '~/lib/useCustomColorScheme';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { UserProvider } from '~/contexts/UserContext';

// Create a client
const queryClient = new QueryClient()

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export const unstable_settings = {
  initialRouteName: "(tabs)/(playlist)/index",
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
//SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorMode = useCustomColorScheme();
  const isDarkColorScheme = colorMode === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <GestureHandlerRootView>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            <Stack>
              <Stack.Screen
                name='landing'
                //modal
                options={{
                  presentation: 'modal',
                  gestureEnabled: false,
                  title: 'Link Spotify Account',
                  headerShown: false,
                  //headerRight: () => <ThemeToggle />,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  title: 'TuneTidy',
                  headerShown: false,
                  //headerRight: () => <ThemeToggle />,
                }}
              />
            </Stack>
            <PortalHost />
          </GestureHandlerRootView>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
