import { useState, memo } from 'react';
import { Select, Heading, Center, Spinner, VStack, FlatList, Box, HStack } from "native-base";
import GenericCard from '../../cards/GenericCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const spotifyLogo = require('../../../assets/Spotify_Icon_CMYK_Black.png');

function TopTracks({ topTracks }) {
  const [timeRange, setTimeRange] = useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" }
  ];

  return (
    <VStack my={'59px'} mx={'25px'}>
      <HStack alignItems={'center'}>
        <Heading size={'xl'} flex={1}>Top Tracks</Heading>
        <Select
          minWidth={135}
          selectedValue={timeRange}
          accessibilityLabel="Choose Time Range"
          placeholder="Choose Time Range"
          onValueChange={setTimeRange}
          variant='filled'
          bgColor={'white'}
          fontWeight={'medium'}
          color={'#5e5e5e'}
          dropdownIcon={<Icon name="calendar" size={20} color={'#5e5e5e'} style={{ marginRight: 5 }} />}
        >
          {timeRanges.map(({ label, value }) => (
            <Select.Item label={label} value={value} key={value} borderRadius={'sm'} />
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
              <GenericCard item={item} index={index} spotifyLogo={spotifyLogo} />
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
