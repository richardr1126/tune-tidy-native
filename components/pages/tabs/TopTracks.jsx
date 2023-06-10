import { useState, memo } from 'react';
import { Select, Heading, Center, Spinner, VStack, FlatList, Box, HStack, useColorModeValue } from "native-base";
import GenericCard from '../../cards/GenericCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { trigger } from 'react-native-haptic-feedback';

const spotifyLogo = require('../../../assets/Spotify_Icon_CMYK_Black.png');

function TopTracks({ topTracks }) {
  const bgColor = useColorModeValue('#f2f2f2', 'black');
  const textColor = useColorModeValue('black', 'gray.400');
  const borderColor = useColorModeValue('#e5e5e5', '#1e1e1e');
  const itemColor = useColorModeValue('white', '#1e1e1e');
  const deviceTheme = useColorModeValue('light', 'dark');
  const [timeRange, setTimeRange] = useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" }
  ];

  return (
    <VStack py={'59px'} px={'25px'} bg={bgColor}>
      <HStack alignItems={'center'}>
        <Heading size={'xl'} flex={1} color={textColor}>Top Tracks</Heading>
        <Select
          minWidth={135}
          selectedValue={timeRange}
          fontWeight={'medium'}
          color={'#5e5e5e'}
          accessibilityLabel="Choose Time Range"
          placeholder="Choose Time Range"
          onValueChange={setTimeRange}
          variant='filled'
          onOpen={() => trigger('impactLight')}
          bgColor={itemColor}
          borderColor={borderColor}
          dropdownIcon={<Icon name="calendar" size={20} color={'#5e5e5e'} style={{ marginRight: 5 }} />}
          _actionSheetContent={{ bgColor: itemColor }}
          _item={{
            _text: {
              color: textColor,
            },
          }}
        >
          {timeRanges.map(({ label, value }) => (
            <Select.Item my={1} bgColor={itemColor} label={label} value={value} key={value} borderRadius={'sm'} />
          ))}
        </Select>
      </HStack>

      {topTracks[timeRange]
        ? (
          <FlatList
            mt={2}
            minH={'100%'}
            data={topTracks[timeRange].items}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<Box height={10} />}
            renderItem={({ item, index }) => (
              <GenericCard deviceTheme={deviceTheme} item={item} index={index} spotifyLogo={spotifyLogo} />
            )}
            keyExtractor={item => item.id}
          />

        ) : (
          <Center m={20}>
            <Spinner accessibilityLabel="Loading..." size={'sm'} color={'grey'} />
          </Center>
        )
      }
    </VStack>
  );
};

export default memo(TopTracks);
