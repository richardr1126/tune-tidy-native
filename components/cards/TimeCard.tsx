import { memo, useState, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { P } from '~/components/ui/typography';
import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import { useStats } from '~/contexts/StatsContext';
import { XCircle } from '~/lib/icons/Close';
import { Flame } from '~/lib/icons/Flame';
import * as Haptics from 'expo-haptics';

function TimeCard({ artistPopup, albumPopup }: { artistPopup?: boolean, albumPopup?: boolean }) {
  const padding = 'px-3 py-1';
  const { timeRange, setTimeRange } = useStats();
  const [hidden, setHidden] = useState(!artistPopup);

  const scaleShortTerm = useRef(new Animated.Value(1)).current;
  const scaleMediumTerm = useRef(new Animated.Value(1)).current;
  const scaleLongTerm = useRef(new Animated.Value(1)).current;

  const isActive = (range: string) => timeRange === range ? 'bg-muted' : '';

  const textColor = (range: string) => timeRange === range ? 'text-foreground' : 'text-muted-foreground';

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

  return (
    <View className='flex-1'>
      {!hidden && (
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
            <Pressable onPress={() => setHidden(true)} className='self-start items-end'>
              <XCircle className='color-primary' size={17} />
            </Pressable>
          </CardContent>
        </Card>
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

export default TimeCard;