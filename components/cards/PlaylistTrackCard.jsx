import React from 'react';
import { Pressable, Container, HStack, VStack, Image, Text } from "native-base";
import * as Linking from 'expo-linking';

export default function PlaylistTrackCard({ index, item, spotifyLogo }) {
  return (
    <Pressable onPress={() => Linking.openURL(item?.external_urls?.spotify)}>
      {({ isPressed }) => (
        <Container my={1} shadow={1} rounded={'md'} bg={'white'} p={1.5} minWidth={'100%'} style={{
          transform: [{
            scale: isPressed ? 0.98 : 1,
          }]
        }}>
          <HStack alignItems="center">
            <Image
              source={{ uri: item?.album?.images[0]?.url }}
              boxSize={'45px'}
              resizeMode="cover"
              alt="Album Art"
              borderRadius={2}
              marginRight={2}
            />
            <Text mr={1} fontWeight='bold' fontSize='md'>{index + 1}.</Text>

            <VStack flex={1}>
              <Text
                mr={'18px'}
                flexShrink={1} // Allow the text to shrink if necessary
                fontWeight="black"
                fontSize="md"
              >
                {item.name}
              </Text>
              <Text fontSize={'sm'}>
                {item.artists.map((artist) => artist.name).join(', ')}
              </Text>
            </VStack>

          </HStack>
          <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'15px'} position={'absolute'} top={2} right={2} />
        </Container>
      )}
    </Pressable>
  );
}