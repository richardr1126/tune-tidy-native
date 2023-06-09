import { Pressable, Container, HStack, VStack, Image, Text } from "native-base";
import * as Linking from 'expo-linking';
import { trigger } from 'react-native-haptic-feedback'

export default function PlaylistTrackCard({ deviceTheme, index, item, spotifyLogo }) {
  const bgColor = deviceTheme === 'dark' ? 'black' : '#f2f2f2';
  const textColor = deviceTheme === 'dark' ? 'gray.100' : 'black';
  const borderColor = deviceTheme === 'dark' ? '#1e1e1e' : '#e5e5e5';
  const itemColor = deviceTheme === 'dark' ? '#141414' : 'white';

  return (
    <Pressable onPress={() => {
      trigger('impactLight');
      Linking.openURL(item?.external_urls?.spotify);
    }}>
      {({ isPressed }) => (
        <Container my={1} rounded={'md'} bg={itemColor} p={1.5} minWidth={'100%'} style={{
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
            {/* <Text mr={1} fontWeight='bold' fontSize='sm'>{index + 1}.</Text> */}

            <VStack flex={1}>
              <Text
                flexShrink={1} // Allow the text to shrink if necessary
                fontWeight="black"
                fontSize="sm"
                mr={'18px'}
                color={textColor}
              >
                {item.name}
              </Text>
              <Text fontSize={'sm'} color={textColor}>
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