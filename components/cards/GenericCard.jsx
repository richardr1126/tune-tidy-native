import React from 'react';
import { Pressable, Container, HStack, VStack, Image, Text } from "native-base";
import * as Linking from 'expo-linking';

const GenericCard = ({ item, index, spotifyLogo }) => {
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
                mr={'18px'}
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
};

export default React.memo(GenericCard);
