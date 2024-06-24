import React, { useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Image } from 'expo-image';
import { blurhash } from '~/lib/utils';
import { Save } from '~/lib/icons/Save';
import { PlusSquare } from '~/lib/icons/PlusSquare';
import * as Haptics from 'expo-haptics';

interface PlaylistHeaderCardProps {
  playlist: any;
  tracks: any[];
  progress: number;
  reorderTracks: any;
  createDuplicatePlaylist: any;
}

export default function PlaylistHeaderCard({ playlist, tracks, reorderTracks, progress, createDuplicatePlaylist }: PlaylistHeaderCardProps) {
  const saveScale = useRef(new Animated.Value(1)).current;
  const duplicateScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const playlistImage = () => {
    if (playlist.images) {
      return playlist.images[0].url;
    } else {
      return require('~/assets/images/playlist_placeholder.png');
    }
  }

  const onSave = () => {
    Haptics.selectionAsync();
    reorderTracks(playlist, tracks);
  };

  const onDuplicate = () => {
    Haptics.selectionAsync();
    createDuplicatePlaylist(playlist, tracks);
  };

  return (
    <View className='flex-1'>
      <Card className='flex-1 mt-2 mx-2 bg-popover shadow-none'>
        <CardContent className='flex-1 flex-row p-2 justify-between items-center gap-2'>
          <Image
            source={playlistImage()}
            style={{ width: 150, height: 150, borderRadius: 6 }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
          <View className='flex-1 gap-2 justify-center'>
            <Animated.View style={{ transform: [{ scale: saveScale }] }}>
              <Pressable
                onPress={onSave}
                onPressIn={() => handlePressIn(saveScale)}
                onPressOut={() => handlePressOut(saveScale)}
                disabled={progress > 0}
                className={'rounded-full flex-row justify-center items-center gap-2 px-3 py-1 bg-muted'}
              >
                <Save size={17} className={'color-foreground'} />
                <Text className={'font-semibold text-center text-foreground'}>
                  Save and reorder
                </Text>
              </Pressable>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: duplicateScale }] }}>
              <Pressable
                onPress={onDuplicate}
                onPressIn={() => handlePressIn(duplicateScale)}
                onPressOut={() => handlePressOut(duplicateScale)}
                disabled={progress > 0}
                className={'rounded-full flex-row justify-center items-center gap-2 px-3 py-1 bg-muted'}
              >
                <PlusSquare size={17} className={'color-foreground'} />
                <Text className={'font-semibold text-center text-foreground'}>
                  Save as new playlist
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}