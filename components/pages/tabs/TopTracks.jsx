import React from 'react';
import { Select, Heading, Center, Spinner, VStack, FlatList } from "native-base";
import GenericCard from '../../cards/GenericCard';

const spotifyLogo = require('../../../assets/Spotify_Icon_CMYK_Black.png');

function TopTracks({ topTracks }) {
  const [timeRange, setTimeRange] = React.useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" }
  ];

  return (
    <VStack my={'50px'} mx={'25px'}>
      <Heading>Top Tracks</Heading>
      <Select selectedValue={timeRange} minWidth={200} maxWidth={200} accessibilityLabel="Choose Time Range" placeholder="Choose Time Range" mt={1} onValueChange={setTimeRange} bg={'white'}>
        {timeRanges.map(({ label, value }) => (
          <Select.Item label={label} value={value} key={value} borderRadius={'sm'} />
        ))}
      </Select>

      {topTracks[timeRange]
        ? (
          <FlatList
            mt={2}
            mb={'15px'}
            data={topTracks[timeRange].items}
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

export default React.memo(TopTracks);
