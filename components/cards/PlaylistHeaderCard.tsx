import React, { useState, useRef } from 'react';
import { View, Pressable, Animated, ScrollView } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Image } from 'expo-image';
import { blurhash, cn } from '~/lib/utils';
import { ChevronDownCircle } from '~/lib/icons/ChevronDown';
import { ChevronUpCircle } from '~/lib/icons/ChevronUp';
import * as Haptics from 'expo-haptics';

interface PlaylistHeaderCardProps {
  playlist: any;
  sortFeature: string;
  setSortFeature: (feature: string) => void;
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

export default function PlaylistHeaderCard({ playlist, sortFeature, setSortFeature }: PlaylistHeaderCardProps) {
  const padding = 'px-3 py-1';
  const [imageSize, setImageSize] = useState(50);

  const isActive = (feature: string) => (sortFeature === feature ? 'bg-muted' : '');
  const textColor = (feature: string) => (sortFeature === feature ? 'text-foreground' : 'text-muted-foreground');

  const onPress = (feature: string) => {
    Haptics.selectionAsync();
    setSortFeature(feature);
  };

  const scaleHeader = useRef(new Animated.Value(1)).current;
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

  const onImagePress = () => {
    setImageSize(imageSize === 50 ? 150 : 50);
  };

  return (
    <View className='flex-1'>
      <Pressable onPressIn={() => handlePressIn(scaleHeader)} onPressOut={() => handlePressOut(scaleHeader)} onPress={onImagePress}>
        <Animated.View style={{ transform: [{ scale: scaleHeader }] }}>
          <Card className='flex-1 mt-2 mx-2 bg-popover shadow-none'>
            <CardContent className='flex-1 flex-row p-2 justify-between items-center'>
              <Image
                source={{ uri: playlist?.images[0]?.url }}
                style={{ width: imageSize, height: imageSize, borderRadius: 6 }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
              {imageSize === 50 ? <ChevronDownCircle size={17} className='color-primary' /> : <ChevronUpCircle size={17} className='color-primary' />}
            </CardContent>
          </Card>
        </Animated.View>
      </Pressable>

      <Card className='flex-1 m-2 bg-popover shadow-none rounded-full'>
        <CardContent className='flex-1 p-1 items-center gap-1'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Animated.View style={{ transform: [{ scale: scaleNone }] }}>
              <Pressable
                onPress={() => onPress('default')}
                onPressIn={() => handlePressIn(scaleNone)}
                onPressOut={() => handlePressOut(scaleNone)}
                className={cn('rounded-full', padding, isActive('default'))}
              >
                <Text className={cn('font-semibold text-center', textColor('default'))}>None</Text>
              </Pressable>
            </Animated.View>
            {otherFeatures.map(({ key, label }) => {
              const scale = scales[key];
              return (
                <Animated.View key={key} style={{ transform: [{ scale }] }}>
                  <Pressable
                    onPress={() => onPress(key)}
                    onPressIn={() => handlePressIn(scale)}
                    onPressOut={() => handlePressOut(scale)}
                    className={cn('rounded-full ml-1', padding, isActive(key))}
                  >
                    <Text className={cn('font-semibold text-center', textColor(key))}>
                      {label}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
            {audioFeatures.map((feature) => {
              const scale = scales[feature];
              return (
                <Animated.View key={feature} style={{ transform: [{ scale }] }}>
                  <Pressable
                    onPress={() => onPress(feature)}
                    onPressIn={() => handlePressIn(scale)}
                    onPressOut={() => handlePressOut(scale)}
                    className={cn('rounded-full ml-1', padding, isActive(feature))}
                  >
                    <Text className={cn('font-semibold text-center', textColor(feature))}>
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
            
          </ScrollView>
        </CardContent>
      </Card>
    </View>
  );
}