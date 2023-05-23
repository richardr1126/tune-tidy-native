import React, { useMemo } from 'react';
import { Select, Heading, Center, Spinner, VStack, FlatList } from "native-base";
import GenericCard from '../../cards/GenericCard';

const spotifyLogo = require('../../../assets/Spotify_Icon_CMYK_Black.png');

function TopAlbums({ topTracks }) {
  const [timeRange, setTimeRange] = React.useState("medium_term");
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
    <VStack my={'50px'} mx={'25px'}>
      <Heading>Top Albums</Heading>
      <Select selectedValue={timeRange} minWidth={200} maxWidth={200} accessibilityLabel="Choose Time Range" placeholder="Choose Time Range" mt={1} onValueChange={setTimeRange} bg={'white'}>
        {timeRanges.map(({ label, value }) => (
          <Select.Item label={label} value={value} key={value} borderRadius={'sm'} />
        ))}
      </Select>

      {sortedTopAlbums
        ? (
          <FlatList
            mt={2}
            mb={'15px'}
            data={sortedTopAlbums}
            showsVerticalScrollIndicator={false}
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

export default React.memo(TopAlbums);
