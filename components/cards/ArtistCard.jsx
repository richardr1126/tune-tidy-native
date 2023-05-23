import React from 'react';
import { Container, HStack, Text, Avatar, Pressable, Image } from "native-base";
import * as Linking from 'expo-linking';

const spotifyLogo = require("../../assets/Spotify_Icon_CMYK_Black.png");

const ArtistCard = ({ item, index }) => {
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
            <Text mr={'18px'} flexShrink={1} flexWrap="wrap" fontWeight='black' fontSize='xl'>{item.name}</Text>
          </HStack>
          <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'15px'} position={'absolute'} top={2} right={2} />
        </Container>
      )}
    </Pressable>
  );
};

export default React.memo(ArtistCard);
