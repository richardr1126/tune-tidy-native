import React, { useEffect } from 'react';
import {
  VStack,
  Heading,
  HStack,
  Button,
  ChevronLeftIcon,
  Image,
  Container,
  Text,
  Center,
  Box,
  Flex,
  Select,
  Spinner,

} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Linking from 'expo-linking';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, clear } from '../../../../utils/asyncStorage';

import spotifyLogo from '../../../../assets/Spotify_Icon_CMYK_Black.png';
import GenericCard from '../../../cards/GenericCard';
import TracksList from './TracksList';

const spotify = new SpotifyWebApi();

function PlaylistEditor({ user, route, navigation }) {
  const [sorter, setSorter] = React.useState('original_position');
  const [tracks, setTracks] = React.useState(null);
  const selectedPlaylist = route.params.selectedPlaylist;

  const handleBackButtonPress = () => {
    //setSelectedPlaylist(null);
    navigation.navigate('Playlist Selector');
    //setTracks(null);
    setSorter('original_position');
  }

  const handleSpotifyButtonPress = () => {
    Linking.openURL(selectedPlaylist.external_urls.spotify);
  }

  const redirectLogin = () => {
    clear();
    navigation.navigate('Landing');
  }

  const setAccessToken = async () => {
    const token = await getData('token');
    console.log('token is: ', token);
    spotify.setAccessToken(token);
    return token;
  }

  // A function to fetch user's top tracks using Spotify Web API
  const fetchPlaylistTracks = async () => {
    const id = selectedPlaylist.id;
    console.log('id: ', id);

    //https://jmperezperez.com/spotify-web-api-js/
    spotify.getPlaylistTracks(id, { limit: 50 })
      .then(async (data) => {
        console.log('Fetched tracks');
        let combinedTracks = data.items;
        const totalTracks = data.total;

        if (totalTracks > 50) {
          for (let offset = 50; offset < totalTracks; offset += 50) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 150));
              const additionalData = await spotify.getPlaylistTracks(id, { limit: 50, offset });
              console.log('Fetching more tracks...');
              combinedTracks = combinedTracks.concat(additionalData.items);
            } catch (error) {
              console.log("Error fetching more tracks from playlist:", error);
              redirectLogin();
              return;
            }
          }
        }

        //full list of tracks, in a simple json object
        combinedTracks = combinedTracks.map((track) => {
          const newTrack = {
            ...track.track,
            added_at: track.added_at,
          };
          delete newTrack.available_markets;
          delete newTrack.disc_number;
          delete newTrack.album.available_markets;
          delete newTrack.album.artists;
          delete newTrack.artists.available_markets;
          return newTrack;
        });
        //remove null ids
        //combinedTracks = combinedTracks.filter((track) => track.id);

        //list of track ids
        const trackIds = combinedTracks.map((track) => track.id);
        //put track ids into chunks of 100
        const trackIdChunks = {};
        for (let i = 0; i < trackIds.length; i += 100) {
          const chunkIndex = i / 100;
          trackIdChunks[chunkIndex] = trackIds.slice(i, i + 100);
        }

        const trackFeatures = [];
        for (const trackIds of Object.values(trackIdChunks)) {
          const chunk = await spotify.getAudioFeaturesForTracks(trackIds);
          trackFeatures.push(...chunk.audio_features); // Destructure the audio_features array
        }

        //console.log(trackFeatures);

        //Combine the track objects with their audio features
        let counter = 0;
        combinedTracks = combinedTracks.map((track, index) => {
          counter++;
          return {
            ...track,
            ...trackFeatures[index],
            original_position: counter,
          };
        });
        console.log(combinedTracks);

        setTracks(combinedTracks);
      })
      .catch((error) => {
        console.log("Error fetching tracks from playlist:", error);
        redirectLogin();
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await setAccessToken();
        await fetchPlaylistTracks();


      } catch (error) {
        console.log("Error fetching data:", error);
        redirectLogin();
      }
    }

    fetchData();

  }, []);

  return (
    <Flex mt={'55px'} mb={'25px'} mx={'25px'}>
      <Container>
        <HStack alignItems="center">
          <Button onPress={handleBackButtonPress}
            p={2}
            mr={2}
            startIcon={<ChevronLeftIcon color='#5e5e5e' size="5" />}
            color={'white'}
            bgColor={'white'}
            shadow={1}
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
      <Text mt={5} mb={'2px'} fontSize={'md'} fontWeight={'medium'}>Sort by:</Text>
      <Box shadow={'1'}>
        <Select selectedValue={sorter} size={'lg'} onValueChange={setSorter} minWidth={'100%'} placeholder="Sort by" variant='filled' bgColor={'white'}>
          <Select.Item label="Current Spotify Postion" value="original_position" borderRadius={4} />
          <Select.Item label="Alphabetical" value="alphabetical" borderRadius={4} />
          <Select.Item label="Artist" value="artist" borderRadius={4} />
          <Select.Item label="Album" value="album" borderRadius={4} />
          <Select.Item label="Genre" value="genre" borderRadius={4} />
          <Select.Item label="Year" value="year" borderRadius={4} />
        </Select>
      </Box>
      {/* Tracks */}
      {tracks ? (
        <TracksList tracks={tracks} spotifyLogo={spotifyLogo} />
      ) : (
        <Center p={20}>
          <Spinner accessibilityLabel="Loading tracks" color={'grey'} />
        </Center>
      )}
    </Flex>
  );
}

export default React.memo(PlaylistEditor);
