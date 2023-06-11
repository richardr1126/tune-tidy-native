import { memo } from "react";
import { Container, HStack, Text, Avatar, Pressable, Image } from "native-base";
import * as Linking from 'expo-linking';
import { trigger } from 'react-native-haptic-feedback'

const spotifyLogo = require("../../assets/Spotify_Icon_CMYK_Green.png");

const ArtistCard = ({ deviceTheme, item, index }) => {
  const bgColor = deviceTheme === 'dark' ? 'black' : '#f2f2f2';
  const textColor = deviceTheme === 'dark' ? 'gray.100' : 'black';
  const borderColor = deviceTheme === 'dark' ? '#1e1e1e' : '#e5e5e5';
  const itemColor = deviceTheme === 'dark' ? '#141414' : 'white';

  const onPress = () => {
    trigger('impactLight')
    Linking.openURL(item.url)
  };

  return (
    <Pressable onPress={onPress}>
      {({ isPressed }) => (
        <Container my={1} rounded={'md'} bg={itemColor} p={1.5} minWidth={'100%'} style={{
          transform: [{
            scale: isPressed ? 0.98 : 1,
          }]
        }}>
          <HStack alignItems="center">
            <Avatar mr={2} size="md" source={{ uri: item?.image }} />
            <Text mr={1} fontWeight='bold' fontSize='xl' color={textColor}>{index + 1}.</Text>
            <Text mr={'18px'} flexShrink={1} flexWrap="wrap" fontWeight='black' fontSize='xl' color={textColor}>{item.name}</Text>
          </HStack>
          <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'15px'} position={'absolute'} top={2} right={2} />
        </Container>
      )}
    </Pressable>
  );
};

export default memo(ArtistCard);
