import React, { useCallback } from 'react';
import { Container, Select, Heading, Text, Center, Spinner, VStack, FlatList, HStack, Image, Pressable } from "native-base";
import * as Linking from 'expo-linking';

const spotifyLogo = require('../assets/Spotify_Icon_CMYK_Black.png');

function TopTracks({ topTracks }) {
  const [timeRange, setTimeRange] = React.useState("medium_term");
  const timeRanges = [
    { label: "Last Month", value: "short_term" },
    { label: "Last 6 Months", value: "medium_term" },
    { label: "All Time", value: "long_term" }
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
            <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'15px'} position={'absolute'} top={2} right={2} />
          </Container>
        )}
      </Pressable>
    );
  }, []);

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

export default React.memo(TopTracks);
