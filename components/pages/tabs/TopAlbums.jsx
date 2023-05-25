import { useMemo, useState, memo } from 'react';
import { Select, Heading, Center, Spinner, VStack, FlatList, Box, HStack } from "native-base";
import GenericCard from '../../cards/GenericCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const spotifyLogo = require('../../../assets/Spotify_Icon_CMYK_Black.png');

function TopAlbums({ topTracks }) {
  const [timeRange, setTimeRange] = useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" }
  ];

  // Grouping tracks by albums and Sorting albums with totalTracks > 5 by the number of tracks in descending order
  const sortedTopAlbums = useMemo(() => {
    const topAlbums = topTracks[timeRange]?.items.reduce((acc, item) => {
      if (!acc[item.albumId]) {
        acc[item.albumId] = {
          name: item.albumName,
          image: item.image,
          url: item.url,
          tracks: [item],
          id: item.albumId,
          totalTracks: item.albumTotalTracks,
          artists: item.albumArtists
        };
      } else {
        acc[item.albumId].tracks.push(item);
      }
      return acc;
    }, {});
    return Object.values(topAlbums)?.filter((album) => album.totalTracks >= 6)?.sort((a, b) => b.tracks.length - a.tracks.length);
  }, [topTracks, timeRange]);

  return (
    <VStack my={'59px'} mx={'25px'}>
      <HStack alignItems={'center'}>
        <Heading size={'xl'} flex={1}>Top Albums</Heading>
        <Select
          minWidth={135}
          selectedValue={timeRange}
          fontWeight={'medium'}
          color={'#5e5e5e'}
          accessibilityLabel="Choose Time Range"
          placeholder="Choose Time Range"
          onValueChange={setTimeRange}
          variant='filled'
          bgColor={'white'}
          dropdownIcon={<Icon name="calendar" size={20} color={'#5e5e5e'} style={{ marginRight: 5 }} />}
        >
          {timeRanges.map(({ label, value }) => (
            <Select.Item label={label} value={value} key={value} borderRadius={'sm'} />
          ))}
        </Select>
      </HStack>

      {sortedTopAlbums
        ? (
          <FlatList
            mt={2}
            minH={'100%'}
            data={sortedTopAlbums}
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

export default memo(TopAlbums);
