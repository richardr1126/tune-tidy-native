import React from 'react';
import { Container, Select, Heading, Text, Center, Spinner, VStack, FlatList, HStack, Image, Pressable } from "native-base";
import * as Linking from 'expo-linking';

function TopAlbums({ topTracks }) {
  const [timeRange, setTimeRange] = React.useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" }
  ];

  // Grouping tracks by albums
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

  // Sorting albums with totalTracks > 5 by the number of tracks in descending order
  const sortedTopAlbums = Object.values(topAlbums)?.filter((album) => album.totalTracks >= 6)?.sort((a, b) => b.tracks.length - a.tracks.length);

  return (
    <VStack my={'50px'} mx={'25px'}>
      <Heading>Top Albums</Heading>
      <Select selectedValue={timeRange} minWidth={200} maxWidth={200} accessibilityLabel="Choose Time Range" placeholder="Choose Time Range" mt={1} onValueChange={itemValue => setTimeRange(itemValue)} bg={'white'}>
        {timeRanges.map((timeRange) => (
          <Select.Item label={timeRange.label} value={timeRange.value} key={timeRange.value} borderRadius={'sm'} />
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
              <Pressable onPress={() => Linking.openURL(item.url)}>
                {({
                  isPressed
                }) => {
                  return <Container my={1} shadow={1} rounded={'md'} bg={'white'} p={1.5} minWidth={'100%'} style={{
                    transform: [{
                      scale: isPressed ? 0.98 : 1,
                    }]
                  }}>
                    <HStack alignItems="center">
                      <Image
                        source={{ uri: item.image }}
                        boxSize={'45px'}
                        resizeMode="cover"
                        alt="Album Art"
                        borderRadius={2}
                        marginRight={2}
                      />
                      <Text mr={1} fontWeight='bold' fontSize='lg'>{index + 1}.</Text>

                      <VStack flex={1}>
                        <Text
                          flexShrink={1} // Allow the text to shrink if necessary
                          fontWeight="black"
                          fontSize="lg"
                        >
                          {item.name}
                        </Text>
                        <Text fontSize={'sm'}>
                          {item.artists}
                        </Text>
                      </VStack>

                    </HStack>
                    <Image
                      source={require('../assets/Spotify_Icon_CMYK_Black.png')}
                      alt="Spotify Logo"
                      boxSize={'15px'}
                      position={'absolute'}
                      top={2}
                      right={2}
                    />
                  </Container>;
                }}
              </Pressable>
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
