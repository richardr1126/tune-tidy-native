import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider, extendTheme } from "native-base";
import { getData } from './utils/asyncStorage';
import 'react-native-url-polyfill/auto';


// Import your screens
import LandingPage from './components/pages/LandingPage';
import Main from './components/pages/Main';
import Instructions from './components/pages/tabs/utils/Instructions';
import CoverImageGenerator from './components/pages/tabs/utils/CoverImageGenerator';

// Create a stack navigator
const Stack = createStackNavigator();

// Define the app component
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkRefreshToken = async () => {
    const refreshToken = await getData('refreshToken');
    if (refreshToken) {
      setLoggedIn(true);
    }
    setIsLoading(false);
  }

  const theme = extendTheme({
    config: {
      initialColorMode: 'dark', // set the initial color mode
      useSystemColorMode: true, // set to true to use the system color mode
    },
  });

  useEffect(() => {
    checkRefreshToken();
    //make status bar black
    //console.log(REACT_APP_NODE_ENV);
    //console.log(Linking.createURL());
  }, []);

  if (isLoading) {
    return <></>; // or some loading component
  }

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={loggedIn ? 'Main' : 'Landing'} screenOptions={{ headerShown: false, freezeOnBlur: true }}>
          <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Instructions" component={Instructions} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Cover Image Generator" component={CoverImageGenerator} options={{ presentation: 'modal' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
