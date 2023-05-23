import React from 'react';
import { VStack, FlatList, Heading, Container, Text, HStack, Image, Pressable } from "native-base";

export default function PlaylistSelector({ playlistData, setSelectedPlaylist }) {
  return (
    <VStack mt={'50px'} mb={'25px'} mx={'25px'}>
      <Heading>Choose a playlist to sort</Heading>
      <FlatList
        mt={2}
        mb={'5px'}
        data={playlistData.items}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelectedPlaylist(item)}>
            {({
              isPressed
            }) => {
              return (
                <Container my={1} shadow={1} rounded={'md'} bg={'white'} p={1.5} minWidth={'100%'} style={{
                  transform: [{
                    scale: isPressed ? 0.98 : 1,
                  }]
                }}>
                  <HStack alignItems="center">
                    <Image
                      source={{ uri: item.images[0].url }}
                      boxSize={'45px'}
                      resizeMode="cover"
                      alt="Playlist Cover"
                      borderRadius={2}
                      marginRight={2}
                    />
                    <Text
                      flexShrink={1} // Allow the text to shrink if necessary
                      fontWeight="black"
                      fontSize="lg"
                    >
                      {item.name}
                    </Text>
                  </HStack>
                </Container>
              );
            }}
          </Pressable>
        )}
        keyExtractor={item => item.id}
      />
    </VStack>
  );
}