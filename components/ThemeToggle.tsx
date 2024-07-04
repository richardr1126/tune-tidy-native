import React, { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<Option>({ value: 'system', label: 'System' });

  useEffect(() => {
    async function fetchData() {
      const storedTheme = await AsyncStorage.getItem('userThemePreference');
      if (storedTheme) {
        const theme = storedTheme === 'light' ? { value: 'light', label: 'Light' } : 
                     storedTheme === 'dark' ? { value: 'dark', label: 'Dark' } :
                     { value: 'system', label: 'System' };
        setSelectedTheme(theme);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedTheme) return;
    setColorScheme(selectedTheme.value as 'light' | 'dark' | 'system');
    setAndroidNavigationBar(selectedTheme.value as 'light' | 'dark');
    AsyncStorage.setItem('userThemePreference', selectedTheme.value);
  }, [selectedTheme]);

  return (
    <Select 
      value={selectedTheme}
      onValueChange={(option) => {
        setSelectedTheme(option);
      }}
      className='w-28'
    >
      <SelectTrigger className=''>
        <SelectValue
          className='text-foreground text-sm native:text-lg'
          placeholder='Select a theme'
        />
      </SelectTrigger>
      <SelectContent className=''>
        <SelectGroup>
          <SelectItem label='System' value='system'>
            System
          </SelectItem>
          <SelectItem label='Light' value='light'>
            Light
          </SelectItem>
          <SelectItem label='Dark' value='dark'>
            Dark
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
