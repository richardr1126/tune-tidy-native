import { memo } from "react";
import { Pressable, Container, HStack, VStack, Image, Text } from "native-base";
import * as Linking from 'expo-linking';
import { trigger } from 'react-native-haptic-feedback'

const GenericCard = ({ deviceTheme, item, index, spotifyLogo }) => {
  const bgColor = deviceTheme === 'dark' ? 'black' : '#f2f2f2';
  const textColor = deviceTheme === 'dark' ? 'gray.400' : 'black';
  const borderColor = deviceTheme === 'dark' ? '#1e1e1e' : '#e5e5e5';
  const itemColor = deviceTheme === 'dark' ? '#1e1e1e' : 'white';
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
            <Image
              source={{ uri: item?.image }}
              boxSize={'45px'}
              resizeMode="cover"
              alt="Album Art"
              borderRadius={2}
              marginRight={2}
            />
            <Text mr={1} fontWeight='bold' fontSize='lg' color={textColor}>{index + 1}.</Text>

            <VStack flex={1}>
              <Text
                mr={'18px'}
                flexShrink={1} // Allow the text to shrink if necessary
                fontWeight="black"
                fontSize="lg"
                color={textColor}
              >
                {item.name}
              </Text>
              <Text fontSize={'sm'} color={textColor}>
                {item.artists}
              </Text>
            </VStack>

          </HStack>
          <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'15px'} position={'absolute'} top={2} right={2} />
        </Container>
      )}
    </Pressable>
  );
};

export default memo(GenericCard);
