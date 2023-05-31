import { VStack, FlatList, Heading, Container, Text, HStack, Image, Pressable, Avatar, useToast } from "native-base";
import { trigger } from 'react-native-haptic-feedback'
import { StatusBar } from 'expo-status-bar';

function PlaylistSelector({ user, playlistData, navigation, refreshing, setRefreshing }) {
  const handlePress = async (item) => {
    //console.log(item);
    trigger('impactLight');
    //toast.close('spotifySynced');
    navigation.navigate('Playlist Editor', { user: user, selectedPlaylist: item });
    
  }


  return (
    <VStack mt={'59px'} mb={'25px'} mx={'25px'}>
      <StatusBar style="dark" />
      <HStack alignItems={'center'}>
        <Heading size={'lg'}>Choose a playlist to sort</Heading>
        <Pressable ml={'auto'} onPress={() => {
          trigger('impactLight');
          navigation.navigate('Profile');
        }}>
          <Avatar size={'md'} source={{ uri: user?.images[0]?.url }} />
        </Pressable>
        {/* Logout button */}
      </HStack>
      
      <FlatList
        mt={2}
        mb={'5px'}
        data={playlistData?.items}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
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