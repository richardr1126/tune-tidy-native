import React, { memo, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { H1, P } from '~/components/ui/typography';
import { Image } from 'expo-image';
import { blurhash } from '~/lib/utils';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';

function TrackCard({ index, track }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    if (track.external_urls.spotify) Linking.openURL(track.external_urls.spotify);
  }

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card className="mx-2 bg-card">
          <CardContent className="flex-row p-2 items-center gap-2 flex-wrap">
            {track?.id && <Image
              source={require('~/assets/images/spotify-icon.png')}
              style={{ width: 14, height: 14, position: 'absolute', top: 4, right: 4 }}
            />}
            <Image
              source={track.album?.images[2]?.url || track.album?.images[1]?.url || track.album?.images[0]?.url}
              style={{ width: 45, height: 45, borderRadius: 6 }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />

            {/* VStack */}
            <View className="flex-1 flex-row gap-1">
              {index && <H1 className="text-md">{index}.</H1>}
              <View className="flex-1 flex-col">
                <H1 className="text-md">{track.name}</H1>
                <P>{track.artists[0].name}</P>
              </View>
            </View>
          </CardContent>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

export default memo(TrackCard);