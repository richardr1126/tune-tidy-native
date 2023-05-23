import React from 'react';
import { VStack, Heading, HStack, Button, ChevronLeftIcon, Image, Container, Text, Center, Box, Flex, Select } from "native-base";
import PlaylistSelector from './utils/PlaylistSelector';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Linking from 'expo-linking';

import spotifyLogo from '../../../assets/Spotify_Icon_CMYK_Black.png';

export default function PlaylistEditor({ user, playlistData }) {
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);
  const [sorter, setSorter] = React.useState('original_position');

  const handleBackButtonPress = () => {
    setSelectedPlaylist(null);
    setSorter('original_position');
  }

  const handleSpotifyButtonPress = () => {
    Linking.openURL(selectedPlaylist.external_urls.spotify);
  }

  return (
    selectedPlaylist === null ? (
      <PlaylistSelector playlistData={playlistData} setSelectedPlaylist={setSelectedPlaylist} />
    ) : (
      <Flex mt={'55px'} mb={'25px'} mx={'25px'}>
        <Container>
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
            <Heading>{selectedPlaylist.name}</Heading>
          </HStack>
        </Container>
        <Center>
          <HStack mt={5} alignItems="center">
            <Container shadow={3}>
              <Image borderRadius={4} source={{ uri: selectedPlaylist.images[0].url }} alt="playlist cover" size='xl' />
            </Container>
            {/* Spotify icon button */}
            <VStack space={1}>
              <Button onPress={handleSpotifyButtonPress} flex={1} ml={2} p={2} bgColor={'#1DB954'} _pressed={{
                opacity: 0.5,
              }}>
                <HStack space={1} alignItems="center" flex={1}>
                  <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'25px'} />
                  <Text color={'black'} fontWeight={'medium'}>View on Spotify</Text>
                </HStack>
              </Button>
              <Button flex={1} ml={2} p={2} bgColor={'#e53e3e'} _pressed={{
                opacity: 0.5,
              }}>
                <HStack space={1} alignItems="center">
                  <Icon name="edit" size={20} color="white" />
                  <Text color={'white'} fontWeight={'medium'}>Override Playlist</Text>
                </HStack>
              </Button>
              <Button variant={'outline'} flex={1} ml={2} p={2} _pressed={{
                opacity: 0.5,
              }}>
                <HStack space={1} alignItems="center">
                  <Icon name="copy" size={20} color="black" />
                  <Text color={'black'} fontWeight={'medium'}>Copy Playlist</Text>
                </HStack>
              </Button>
            </VStack>
          </HStack>
        </Center>
        {/* Sorter selection */}
        <Text mt={5} mb={'2px'} fontWeight={'medium'}>Sort by:</Text>
        <Box shadow={'1'}>
          <Select selectedValue={sorter} onValueChange={setSorter} minWidth={'100%'} placeholder="Sort by" variant='filled'>
            <Select.Item label="Current Spotify Postion" value="original_position" borderRadius={4} />
            <Select.Item label="Alphabetical" value="alphabetical" borderRadius={4} />
            <Select.Item label="Artist" value="artist" borderRadius={4} />
            <Select.Item label="Album" value="album" borderRadius={4} />
            <Select.Item label="Genre" value="genre" borderRadius={4} />
            <Select.Item label="Year" value="year" borderRadius={4} />
          </Select>
        </Box>


      </Flex>
    )
  );
}
