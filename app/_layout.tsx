import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
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
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const userThemePreference = await AsyncStorage.getItem('userThemePreference');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!userThemePreference) {
        setColorScheme('system');
        setIsColorSchemeLoaded(true);
        return;
      }
      if (userThemePreference !== colorScheme) {
        setColorScheme(userThemePreference as 'light' | 'dark' | 'system');
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <GestureHandlerRootView>
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    title: 'TuneTidy',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='landing'
                  //modal
                  options={{
                    presentation: 'modal',
                    gestureEnabled: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='art'
                  //modal
                  options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    headerShown: false,
                  }}
                />
              </Stack>
            </GestureHandlerRootView>
          </ThemeProvider>
        </UserProvider>
      </QueryClientProvider>
      <PortalHost />
    </>
  );
}
