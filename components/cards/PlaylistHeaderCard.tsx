import React, { useState, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Image } from 'expo-image';
import { blurhash, cn } from '~/lib/utils';
import { ChevronDownCircle } from '~/lib/icons/ChevronDown';
import { ChevronUpCircle } from '~/lib/icons/ChevronUp';
import * as Haptics from 'expo-haptics';

interface PlaylistHeaderCardProps {
  playlist: any;
  tracks: any[];
  reorderTracks: any;
  createDuplicatePlaylist: any;
}

export default function PlaylistHeaderCard({ playlist, tracks, reorderTracks, createDuplicatePlaylist }: PlaylistHeaderCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onPress = () => {
    // Handle the press action here
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    reorderTracks(playlist, tracks);
  };

  return (
    <View className='flex-1'>
      <Card className='flex-1 mt-2 mx-2 bg-popover shadow-none'>
        <CardContent className='flex-1 flex-row p-2 justify-center items-center'>
          <Image
            source={{ uri: playlist?.images[0]?.url }}
            style={{ width: 150, height: 150, borderRadius: 6 }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className={'rounded-full flex-row ml-1 items-center gap-1 px-3 py-1 bg-muted'}
            >
              <Text className={'font-semibold text-center text-foreground'}>
                Save to Spotify
              </Text>
            </Pressable>
          </Animated.View>
        </CardContent>
      </Card>
    </View>
  );
}