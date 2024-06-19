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
  sortFeature: { feature: string, order: 'asc' | 'desc' };
  setSortFeature: (feature: { feature: string, order: 'asc' | 'desc' }) => void;
}

export default function PlaylistHeaderCard({ playlist, sortFeature, setSortFeature }: PlaylistHeaderCardProps) {
  const [imageSize, setImageSize] = useState(50);

  const scaleHeader = useRef(new Animated.Value(1)).current;

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
    </View>
  );
}