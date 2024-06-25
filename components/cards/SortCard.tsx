import React, { memo, useRef } from 'react';
import { ScrollView, Pressable, Animated, View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { ChevronDown } from '~/lib/icons/ChevronDown';
import { ChevronUp } from '~/lib/icons/ChevronUp';
import * as Haptics from 'expo-haptics';
import { cn } from '~/lib/utils';

interface SortCardProps {
  sortFeature: { feature: string, order: 'asc' | 'desc' };
  setSortFeature: (feature: { feature: string, order: 'asc' | 'desc' }) => void;
}

const audioFeatures = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'loudness',
  'speechiness',
  'valence',
];

const otherFeatures = [
  { key: 'trackName', label: 'Track Name' },
  { key: 'dateAdded', label: 'Date Added' },
  { key: 'releaseDate', label: 'Release Date' },
  { key: 'albumName', label: 'Album Name' },
  { key: 'artistName', label: 'Artist Name' }
];

function SortCard({ sortFeature, setSortFeature }: SortCardProps) {
  const padding = 'px-3 py-1';

  const isActive = (feature: string) => (sortFeature.feature === feature ? 'bg-muted' : '');
  const textColor = (feature: string) => (sortFeature.feature === feature ? 'text-foreground' : 'text-muted-foreground');

  const onPress = (feature: string) => {
    Haptics.selectionAsync();
    const newOrder = sortFeature.feature === feature && sortFeature.order === 'asc' ? 'desc' : 'asc';
    setSortFeature({ feature, order: newOrder });
  };

  const scaleNone = useRef(new Animated.Value(1)).current;
  const scales = useRef([...audioFeatures, ...otherFeatures.map(f => f.key)].reduce((acc, feature) => {
    acc[feature] = new Animated.Value(1);
    return acc;
  }, {} as Record<string, Animated.Value>)).current;

  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Card className='m-2 bg-popover shadow-none rounded-full'>
      <CardContent className='p-1 items-center gap-1'>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Animated.View style={{ transform: [{ scale: scaleNone }]}}>
            <Pressable
              onPress={() => onPress('default')}
              onPressIn={() => handlePressIn(scaleNone)}
              onPressOut={() => handlePressOut(scaleNone)}
              className={cn('rounded-full', padding, isActive('default'))}
            >
              <Text className={cn('font-semibold text-center', textColor('default'))}>None</Text>
            </Pressable>
          </Animated.View>
          {audioFeatures.map((feature) => {
            const scale = scales[feature];
            return (
              <Animated.View key={feature} style={{ transform: [{ scale }] }}>
                <Pressable
                  onPress={() => onPress(feature)}
                  onPressIn={() => handlePressIn(scale)}
                  onPressOut={() => handlePressOut(scale)}
                  className={cn('rounded-full flex-row ml-1 items-center gap-1', padding, isActive(feature))}
                >
                  <Text className={cn('font-semibold text-center', textColor(feature))}>
                    {feature.charAt(0).toUpperCase() + feature.slice(1)}
                  </Text>
                  {sortFeature.feature === feature && (
                    sortFeature.order === 'asc' ? <ChevronDown size={15} className='color-foreground' /> : <ChevronUp size={15} className='color-foreground' />
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
          {otherFeatures.map(({ key, label }) => {
            const scale = scales[key];
            return (
              <Animated.View key={key} style={{ transform: [{ scale }]}}>
                <Pressable
                  onPress={() => onPress(key)}
                  onPressIn={() => handlePressIn(scale)}
                  onPressOut={() => handlePressOut(scale)}
                  className={cn('rounded-full flex-row ml-1 items-center gap-1', padding, isActive(key))}
                >
                  <Text className={cn('font-semibold text-center', textColor(key))}>
                    {label}
                  </Text>
                  {sortFeature.feature === key && (
                    sortFeature.order === 'asc' ? <ChevronDown size={15} className='color-foreground' /> : <ChevronUp size={15} className='color-foreground' />
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      </CardContent>
    </Card>
  );
}

export default memo(SortCard);