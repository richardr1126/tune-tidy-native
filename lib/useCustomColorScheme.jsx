import { useLayoutEffect, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { getData } from '~/utils/asyncStorage';
import { addEventListener, removeEventListener } from '~/utils/eventEmitter';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

const useCustomColorScheme = () => {
  const systemColorScheme = useRNColorScheme();
  const { colorScheme: nativewindColorScheme, setColorScheme: setNativeWindColorScheme } = useNativewindColorScheme();
  const [colorScheme, setColorScheme] = useState('uninitialized'); // Use 'uninitialized' or null initially

  useLayoutEffect(() => {
    let isMounted = true; // Track if component is mounted to prevent state update on unmounted component

    const updateScheme = async () => {
      const storedColorScheme = await getData('colorSchemePreference');
      if (isMounted) {

        setColorScheme(storedColorScheme === 'alwaysDark' ? 'dark' : systemColorScheme);
      }
    };

    updateScheme(); // Initial check

    // Listen for changes
    const unsubscribe = addEventListener('colorSchemeChanged', (newScheme) => {
      if (isMounted) {

        setColorScheme(newScheme === 'alwaysDark' ? 'dark' : systemColorScheme);
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      unsubscribe(); // Directly use the unsubscribe function returned by addEventListener
    };
  }, [systemColorScheme]);

  // Avoid rendering your theme-dependent components until 'colorScheme' is not 'uninitialized'
  return colorScheme === 'uninitialized' ? systemColorScheme : colorScheme;
};

export default useCustomColorScheme;
