import { memo, useState, useRef, useEffect } from 'react';
import { View, Pressable, Animated, Easing } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { P } from '~/components/ui/typography';
import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import { useStats } from '~/contexts/StatsContext';
import { XCircle } from '~/lib/icons/Close';
import { Flame } from '~/lib/icons/Flame';
import * as Haptics from 'expo-haptics';
import { storeData, getData, clear } from '~/utils/asyncStorage';

function TimeCard({ artistPopup, albumPopup }: { artistPopup?: boolean, albumPopup?: boolean }) {
  const { timeRange, setTimeRange } = useStats();
  const [hidden, setHidden] = useState(true);

  const scaleShortTerm = useRef(new Animated.Value(1)).current;
  const scaleMediumTerm = useRef(new Animated.Value(1)).current;
  const scaleLongTerm = useRef(new Animated.Value(1)).current;

  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupScale = useRef(new Animated.Value(0.5)).current;

  const isActive = (range: string) => (timeRange === range ? 'bg-muted' : '');

  const textColor = (range: string) => (timeRange === range ? 'text-foreground' : 'text-muted-foreground');

  const onPress = (range: string) => {
    Haptics.selectionAsync();
    setTimeRange(range);
  };

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

  const handleClosePopupPress = () => {
    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(popupScale, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setHidden(true);
      storeData('artistPopupSeen', 'true');
    });
  };

  useEffect(() => {
    if (artistPopup) {
      //clear();
      getData('artistPopupSeen').then((seen) => {
        if (seen !== 'true') {
          setHidden(false);
          Animated.parallel([
            Animated.timing(popupOpacity, {
              toValue: 1,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.spring(popupScale, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });
    }
  }, [popupOpacity, popupScale]);

  useEffect(() => {
    if (!hidden) {
      Animated.parallel([
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(popupScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [hidden, popupOpacity, popupScale]);

  const padding = 'px-3 py-1';

  return (
    <View className='flex-1'>
      {!hidden && (
        <Animated.View style={{ opacity: popupOpacity, transform: [{ scale: popupScale }] }}>
          <Card className='flex-1 mt-2 mx-2 bg-popover shadow-none'>
            <CardContent className='flex-1 flex-row py-2 px-2 items-center gap-4'>
              <Flame className='color-primary' />
              <View className='flex-1 gap-2'>
                <P className='text-left'>
                  Here you can view your top Spotify stats in 3 different time ranges.
                </P>
                <View className='gap-0.5'>
                  <P className='text-left'>Last Month</P>
                  <P className='text-left'>6 Months</P>
                  <P className='text-left'>Long Term (~2 years)</P>
                </View>
              </View>
              <Pressable onPress={handleClosePopupPress} className='self-start items-end'>
                <XCircle className='color-primary' size={17} />
              </Pressable>
            </CardContent>
          </Card>
        </Animated.View>
      )}

      <Card className='flex-1 m-2 bg-popover shadow-none rounded-full'>
        <CardContent className='flex-1 flex-row p-1 items-center gap-1'>
          <Animated.View className='flex-1' style={{ transform: [{ scale: scaleShortTerm }] }}>
            <Pressable
              onPress={() => onPress('short_term')}
              onPressIn={() => handlePressIn(scaleShortTerm)}
              onPressOut={() => handlePressOut(scaleShortTerm)}
              className={cn('flex-1 rounded-full', padding, isActive('short_term'))}
            >
              <Text className={cn('font-semibold text-center', textColor("short_term"))}>Last Month</Text>
            </Pressable>
          </Animated.View>

          <Animated.View className='flex-1' style={{ transform: [{ scale: scaleMediumTerm }] }}>
            <Pressable
              onPress={() => onPress('medium_term')}
              onPressIn={() => handlePressIn(scaleMediumTerm)}
              onPressOut={() => handlePressOut(scaleMediumTerm)}
              className={cn('flex-1 rounded-full', padding, isActive('medium_term'))}
            >
              <Text className={cn('font-semibold text-center', textColor("medium_term"))}>6 Months</Text>
            </Pressable>
          </Animated.View>

          <Animated.View className='flex-1' style={{ transform: [{ scale: scaleLongTerm }] }}>
            <Pressable
              onPress={() => onPress('long_term')}
              onPressIn={() => handlePressIn(scaleLongTerm)}
              onPressOut={() => handlePressOut(scaleLongTerm)}
              className={cn('flex-1 rounded-full', padding, isActive('long_term'))}
            >
              <Text className={cn('font-semibold text-center', textColor("long_term"))}>Long Term</Text>
            </Pressable>
          </Animated.View>
        </CardContent>
      </Card>

      {albumPopup && (
        <Card className='flex-1 m-2 mt-0 bg-popover shadow-none'>
          <CardContent className='flex-1 px-4 py-2'>
            <P className='text-left'>
              Top Albums may take a while to load as it is calculated on device with all of your Top Tracks.
            </P>
          </CardContent>
        </Card>
      )}
    </View>
  );
}

export default memo(TimeCard);
