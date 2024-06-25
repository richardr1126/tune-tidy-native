import React, { memo, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Card, CardContent } from '~/components/ui/card';
import { H1, P } from '~/components/ui/typography';
import { Image } from 'expo-image';
import { Trash } from '~/lib/icons/Trash';
import { Sparkles } from '~/lib/icons/Magic';
import * as Haptics from 'expo-haptics';
import { blurhash } from '~/lib/utils';
import SpotifyWebApi from 'spotify-web-api-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

const spotify = new SpotifyWebApi();

function PlaylistCard({ playlist }: any) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const swipeRef = useRef<Swipeable>(null);

  const actionScale1 = useRef(new Animated.Value(1)).current;
  const actionScale = useRef(new Animated.Value(1)).current;

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

  const handleActionPressIn = () => {
    Animated.spring(actionScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleActionPressOut = () => {
    Animated.spring(actionScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    console.log('Pressed playlist:', playlist.name);
    
    router.push({ pathname: '(playlist)/[playlist]', params: { playlist: playlist.id } });
  };

  const onTrashPress = () => {
    console.log('Trash pressed');
    Haptics.selectionAsync();
    swipeRef.current?.close();
    // Add your edit functionality here
    spotify.unfollowPlaylist(playlist.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
  };

  const onSparklesPress = () => {
    console.log('Sparkles pressed');
    Haptics.selectionAsync();
    swipeRef.current?.close();
    // Add your sort functionality here
    router.push({ pathname: 'art', params: { playlist: JSON.stringify(playlist) } });
  };

  const renderRightActions = (progress: any, dragX: any) => {
    const rightActionWidth = 90;
    const translateX = dragX.interpolate({
      inputRange: [-rightActionWidth - 8, 0],
      outputRange: [0, rightActionWidth + 8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View className='flex-row mr-2' style={{ width: rightActionWidth, transform: [{ translateX }] }}>
        
        <View className='flex-1 flex-row justify-end'>
          <Animated.View className='flex-1' style={{ transform: [{ scale: actionScale }] }}>
            <Pressable
              className='flex-1 bg-destructive rounded-md justify-center items-center'
              onPressIn={handleActionPressIn}
              onPressOut={handleActionPressOut}
              onPress={onTrashPress}
            >
              <Trash size={24} className="color-popover" />
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const playlistImage = () => {
    if (playlist.images) {
      return playlist.images[0].url;
    } else {
      return require('~/assets/images/playlist_placeholder.png');
    }
  }

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeRef} overshootRight={false}>
      <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={{ transform: [{ scale }], flexDirection: 'row' }}>
          <View className='w-2'/>

          <Card className="flex-1 bg-card">
            <CardContent className="flex-row p-2 items-center gap-2 flex-wrap">
              <Image
                source={playlistImage()}
                style={{ width: 45, height: 45, borderRadius: 6 }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
              <View className="flex-1 flex-col">
                <View className="flex-row items-center gap-2 flex-wrap">
                  <H1 className="text-lg">{playlist.name}</H1>
                  <P className="text-sm">{playlist.tracks.total} tracks</P>
                </View>
                {playlist.description && <P>{playlist.description}</P>}
              </View>
            </CardContent>
          </Card>
          <View className='w-2'/>
        </Animated.View>
      </Pressable>
    </Swipeable>
  );
}

export default memo(PlaylistCard);