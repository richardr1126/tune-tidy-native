import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from "native-base";
import { getData } from './utils/asyncStorage';

// Import your screens
import LandingPage from './components/pages/LandingPage';
import Main from './components/pages/Main';

// Create a stack navigator
const Stack = createStackNavigator();

// Define the app component
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkTokenExpiration = async () => {
    const tokenExpiration = await getData('tokenExpiration');
    if (tokenExpiration !== null) {
      console.log('tokenExpiration is not null');
      if (Date.now() < tokenExpiration) {
        setLoggedIn(true);
      }
    } else {
      console.log('tokenExpiration is null');
      setLoggedIn(false);
    }
    setIsLoading(false); // loading completed
  }

  useEffect(() => {
    checkTokenExpiration();
    //console.log(REACT_APP_NODE_ENV);
    //console.log(Linking.createURL());
  }, []);

  if (isLoading) {
    return <></>; // or some loading component
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={loggedIn ? 'Main' : 'Landing'} screenOptions={{ headerShown: false, gestureEnabled: false, freezeOnBlur: true }}>
          <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
