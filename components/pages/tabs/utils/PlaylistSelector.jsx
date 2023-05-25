import React from 'react';
import { VStack, FlatList, Heading, Container, Text, HStack, Image, Pressable } from "native-base";

function PlaylistSelector({ playlistData, navigation }) {
  const handlePress = (item) => {
    console.log(item);
    navigation.navigate('Playlist Editor', { selectedPlaylist: item });
  }


  return (
    <VStack mt={'59px'} mb={'25px'} mx={'25px'}>
      <Heading size={'lg'}>Choose a playlist to sort</Heading>
      <FlatList
        mt={2}
        mb={'5px'}
        data={playlistData.items}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Container height={10} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item)}>
            {({
              isPressed
            }) => {
              return (
                <Container my={1} rounded={'md'} bg={'white'} p={2} minWidth={'100%'} style={{
                  transform: [{
                    scale: isPressed ? 0.98 : 1,
                  }]
                }}>
                  <HStack alignItems="center">
                    <Image
                      source={{ uri: item.images[0].url }}
                      boxSize={'80px'}
                      resizeMode="cover"
                      alt="Playlist Cover"
                      borderRadius={2}
                      marginRight={3}
                    />
                    <Text
                      flexShrink={1} // Allow the text to shrink if necessary
                      fontWeight="black"
                      fontSize="xl"
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

export default PlaylistSelector;