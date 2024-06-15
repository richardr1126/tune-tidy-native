import {
  Card,
  CardContent,
} from '~/components/ui/card';
import { H1, P } from '~/components/ui/typography';
import { Image } from 'expo-image';
import { View, Pressable, Animated } from 'react-native';
import { blurhash, cn } from '~/lib/utils';
import { memo, useRef } from 'react';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';

function ArtistCard({ index, artist }: any) {
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
    Linking.openURL(artist.external_urls.spotify);
  }

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card className="bg-card mx-2">
          <CardContent className="flex-row p-2 items-center gap-2 flex-wrap">
            <Image
              source={require('~/assets/images/spotify-icon.png')}
              style={{ width: 13, height: 13, position: 'absolute', top: 4, right: 4 }}
            />

            <Image
              source={artist.images[0]?.url}
              style={{ width: 55, height: 55, borderRadius: 100 }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />

            <H1 className="text-xl">{index}. {artist.name}</H1>
          </CardContent>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

export default memo(ArtistCard);