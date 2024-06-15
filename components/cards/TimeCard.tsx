import { memo, useState } from 'react';
import { View, Pressable } from 'react-native';
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

  const isActive = (range: string) => timeRange === range ? 'bg-muted' : '';

  const textColor = (range: string) => timeRange === range ? 'text-foreground' : 'text-muted-foreground';

  const onPress = (range: string) => {
    Haptics.selectionAsync();
    setTimeRange(range);
  }

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
                <P className='text-left'>1 Month (last month)</P>
                <P className='text-left'>6 Months (last 6 months)</P>
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
          <Pressable
            onPress={() => onPress('short_term')}
            className={cn('flex-1 rounded-full', padding, isActive('short_term'))}
          >
            <Text className={cn('font-semibold text-center', textColor("short_term"))}>1 Month</Text>
          </Pressable>

          <Pressable
            onPress={() => onPress('medium_term')}
            className={cn('flex-1 rounded-full', padding, isActive('medium_term'))}
          >
            <Text className={cn('font-semibold text-center', textColor("medium_term"))}>6 Months</Text>
          </Pressable>
          <Pressable
            onPress={() => onPress('long_term')}
            className={cn('flex-1 rounded-full', padding, isActive('long_term'))}
          >
            <Text className={cn('font-semibold text-center', textColor("long_term"))}>Long Term</Text>
          </Pressable>
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