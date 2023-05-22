import React from 'react';
import { VStack, FlatList, Heading, Container, Text, HStack, Image, Pressable, Button, ChevronLeftIcon } from "native-base";
import * as Linking from 'expo-linking';
import PlaylistSelector from './PlaylistSelector';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function PlaylistEditor({ user, playlistData }) {
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);

  const handleBackButtonPress = () => {
    setSelectedPlaylist(null);
  }

  return (
    selectedPlaylist === null ? (
      <PlaylistSelector playlistData={playlistData} setSelectedPlaylist={setSelectedPlaylist} />
    ) : (
      <VStack mt={'55px'} mb={'25px'} mx={'25px'}>
        <HStack alignItems="center">
          <Button onPress={handleBackButtonPress}
            p={2}
            mr={2}
            startIcon={<ChevronLeftIcon color='#5e5e5e' size="5" />}
            color={'white'}
            bgColor={'white'}
            _pressed={{
              bgColor: 'white',
              opacity: 0.2
            }}
          >
          </Button>
          <Heading>Editing {selectedPlaylist.name}</Heading>
        </HStack>


      </VStack>
    )
  );
}
