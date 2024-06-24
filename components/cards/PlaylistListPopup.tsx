import {
  Card,
  CardContent,
} from '~/components/ui/card';
import { H1, P } from '~/components/ui/typography';
import { Pressable, View, Animated, Easing } from 'react-native';
import { Button } from '../ui/button';
import { XCircle } from '~/lib/icons/Close';
import { memo, useEffect, useState, useRef } from 'react';
import { Edit } from '~/lib/icons/Edit';
import { getData, storeData } from '~/utils/asyncStorage';

function PlaylistListPopup() {
  const [hidden, setHidden] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  const handleClosePopupPress = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setHidden(true);
      storeData('playlistListPopupSeen', 'true');
    });
  }

  useEffect(() => {
    getData('playlistListPopupSeen').then((seen) => {
      if (seen !== 'true') {
        setHidden(false);
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [opacity, scale]);

  useEffect(() => {
    if (!hidden) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [hidden, opacity, scale]);

  return (
    <>
    {!hidden && <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Card className='m-2 bg-popover shadow-none'>
        <CardContent className='flex-row py-2 px-2 items-center gap-4'>
          <Edit className='color-primary' />
          <P className='flex-1 text-left'>
            Here you can sort and manage your playlists.
            You can delete playlists or create AI cover art by swiping on your playlist.
            Please select a playlist to get started.
          </P>

          <Pressable onPress={handleClosePopupPress} className='self-start items-end'>
            <XCircle className='color-primary' size={17} />
          </Pressable>
        </CardContent>
      </Card>
    </Animated.View>}
    </>
  );
}

export default memo(PlaylistListPopup);
