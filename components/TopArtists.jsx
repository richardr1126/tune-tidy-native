import React, { useCallback } from 'react';
import { Container, Select, Heading, Text, Center, Spinner, Box, VStack, FlatList, HStack, Image, Avatar, Pressable } from "native-base";
import * as Linking from 'expo-linking';

const spotifyLogo = require('../assets/Spotify_Icon_CMYK_Black.png');

function TopArtists({ topArtists }) {
  const [timeRange, setTimeRange] = React.useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" },
  ];


  const renderItem = useCallback(({ item, index }) => {
    const onPress = () => Linking.openURL(item.url);

    return (
      <Pressable onPress={onPress}>
        {({ isPressed }) => (
          <Container my={1} shadow={1} rounded={'md'} bg={'white'} p={1.5} minWidth={'100%'} style={{
            transform: [{
              scale: isPressed ? 0.98 : 1,
            }]
          }}>
            <HStack alignItems="center">
              <Avatar mr={2} size="md" source={{ uri: item.image }} />
              <Text mr={1} fontWeight='bold' fontSize='xl'>{index + 1}.</Text>
              <Text flexShrink={1} flexWrap="wrap" fontWeight='black' fontSize='xl'>{item.name}</Text>
            </HStack>
            <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'15px'} position={'absolute'} top={2} right={2} />
          </Container>
        )}
      </Pressable>
    );
  }, []);

  return (
    <VStack my={'50px'} mx={'25px'}>
      <Heading>Top Artists</Heading>
      <Select selectedValue={timeRange} minWidth={200} maxWidth={200} accessibilityLabel="Choose Time Range" placeholder="Choose Time Range" mt={1} onValueChange={setTimeRange} bg={'white'}>
        {timeRanges.map(({ label, value }) => (
          <Select.Item label={label} value={value} key={value} borderRadius={'sm'} />
        ))}
      </Select>

      {topArtists[timeRange]
        ? (
          <FlatList
            mt={2}
            mb={'15px'}
            data={topArtists[timeRange].items}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
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

export default React.memo(TopArtists);
