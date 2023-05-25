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
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Linking from 'expo-linking';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, clear } from '../../../../utils/asyncStorage';

import spotifyLogo from '../../../../assets/Spotify_Icon_CMYK_Black.png';
import TracksList from './TracksList';
import { Sorters } from '../../../../utils/Sorter';

const spotify = new SpotifyWebApi();

function PlaylistEditor({ user, route, navigation }) {
  const [sorter, setSorter] = React.useState('original_position');
  const [sorterDirection, setSorterDirection] = React.useState('asc');
  const [progress, setProgress] = React.useState(0);
  const [tracks, setTracks] = React.useState(null);
  const selectedPlaylist = route.params.selectedPlaylist;

  const sorterOptions = {
    'Original Position': 'original_position',
    'Name': 'name',
    'Album Name': 'album_name',
    'Artist Name': 'artist_name',
    'Release Date': 'release_date',
    'Popularity': 'popularity',
    'Date Added': 'date_added',
    'Tempo': 'tempo',
    'Acousticness': 'acousticness',
    'Danceability': 'danceability',
    'Energy': 'energy',
    'Instrumentalness': 'instrumentalness',
    'Liveness': 'liveness',
    'Loudness': 'loudness',
    'Speechiness': 'speechiness',
    'Valence': 'valence',
  };

  const toggleSortDirection = () => {
    if (sorterDirection === 'asc') {
      setSorterDirection('desc');
      setTracks(tracks.reverse());
    } else {
      setSorterDirection('asc');
      setTracks(tracks.reverse());
    }
  }

  const handleSorterChange = (value) => {
    setSorter(value);

    // Use sorter method from Sorter module
    if (tracks) {
      const sorterMethod = Sorters[value];
      //console.log('sorterMethod: ', sorterMethod);
      if (sorterMethod) {
        setTracks(sorterMethod(tracks, sorterDirection));
      }
    }
  }

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

  const overridePlaylist = async (playlist, tracks) => {
    const playlistId = playlist.id;
    const newOrder = tracks.slice();
    const batchSize = 10; // Adjust the batch size to your preference

    const playlistDetails = await spotify.getPlaylist(playlistId);
    let snapshotId = playlistDetails.snapshot_id;

    const reorderingOperations = newOrder.map((track, newPosition) => {
      const currentPosition = track.original_position - 1;
      return { currentPosition, newPosition };
    });

    reorderingOperations.sort((a, b) => a.newPosition - b.newPosition);

    for (let i = 0; i < reorderingOperations.length; i++) {
      const operation = reorderingOperations[i];
      const { currentPosition, newPosition } = operation;

      if (currentPosition !== newPosition) {
        try {
          console.log(`Reordering track from position ${currentPosition} to ${newPosition}`);

          await new Promise((resolve) => setTimeout(resolve, 75));
          const data = await spotify.reorderTracksInPlaylist(playlistId, currentPosition, newPosition, {
            snapshot_id: snapshotId,
          });
          snapshotId = data.snapshot_id;

          for (const op of reorderingOperations) {
            if (op.currentPosition > currentPosition && op.currentPosition <= newPosition) {
              op.currentPosition -= 1;
            } else if (op.currentPosition < currentPosition && op.currentPosition >= newPosition) {
              op.currentPosition += 1;
            }
          }

          // Update the progress bar after every batchSize operations
          if (i % batchSize === batchSize - 1 || i === reorderingOperations.length - 1) {
            setProgress(((i + 1) / tracks.length) * 100);
          }
        } catch (error) {
          console.error(`Error reordering track from position ${currentPosition} to ${newPosition}:`, error);
          redirectLogin();
          return;
        }
      }
    }

    fetchPlaylistTracks();
  }

  // Creates a new playlist with the same name as the original playlist, but with "(Tune Tidy)" appended to the end
  const createNewPlaylist = async (playlist, tracks) => {
    await setAccessToken();
    spotify.createPlaylist(playlist.owner.id, {
      name: playlist.name + " - Sorted",
      description: playlist.description + (playlist.description ? ". " : "") + "Sorted by " + sorter + " " + sorterDirection,
    }).then(async (data) => {
      console.log(data);
      const newPlaylistId = data.id;
      //only map uris of tracks that have an id
      const trackUris = tracks.filter((track) => track.id).map((track) => track.uri);

      //track URIs into chunks of 100
      const trackUriChunks = {};
      for (let i = 0; i < trackUris.length; i += 100) {
        const chunkIndex = i / 100;
        trackUriChunks[chunkIndex] = trackUris.slice(i, i + 100);
      }

      //adding tracks to new playlist in chunks of 100
      for (const trackUris of Object.values(trackUriChunks)) {
        console.log(trackUris);
        const chunk = await spotify.addTracksToPlaylist(newPlaylistId, trackUris);
        console.log(chunk);
      }

    }).catch((error) => {
      console.log(error);
      redirectLogin();
    });

  }

  // Add this in your PlaylistEditor component
  const scrollY = React.useRef(new Animated.Value(0)).current;
  // In your PlaylistEditor component
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -300],
    extrapolate: 'clamp', // This will prevent the value from going beyond the output range
  });
  // Define another translateY animation for the rest of the content
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -180],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!tracks) {
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
    }

  }, []);

  function getSortIcon() {
    // if (sorter === 'name' || sorter === 'album_name') {
    //   return (<Icon name="sort-alpha-down" size={20} color={'#5e5e5e'} style={{ marginRight: 5 }} />);
    // }
    if (sorterDirection === 'asc') {
      if (sorter === 'name' || sorter === 'album_name' || sorter === 'artist_name') {
        return (<Icon name="sort-alpha-down" size={20} color={'#5e5e5e'} />);
      } else if (sorter === 'original_position') {
        return (<Icon name={"sort-numeric-down"} size={20} color={'#5e5e5e'} />);
      }
      return (<Icon name={"sort-amount-down-alt"} size={20} color={'#5e5e5e'}/>);
    } else {
      if (sorter === 'name' || sorter === 'album_name' || sorter === 'artist_name') {
        return (<Icon name="sort-alpha-down-alt" size={20} color={'#5e5e5e'} />);
      } else if (sorter === 'original_position') {
        return (<Icon name={"sort-numeric-down-alt"} size={20} color={'#5e5e5e'} />);
      }
      return (<Icon name={"sort-amount-down"} size={20} color={'#5e5e5e'} />);
    }
  }


  return (
    <>
      <Box shadow={'1'} height={'100px'} width={'100%'} position={'absolute'} top={0} left={0} bgColor={'white'} zIndex={1}>
        <Container mt={'55px'} mb={'25px'} mx={'25px'}>
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
      </Box>
      <Flex mt={'90px'} mb={'25px'} mx={'25px'}>

        <Animated.View
          style={{
            transform: [{ translateY: headerTranslateY }],
          }}
          zIndex={0}
        >
          <Center>
            <HStack mt={5} alignItems="center">
              <Container shadow={3}>
                <Image borderRadius={4} source={{ uri: selectedPlaylist.images[0].url }} alt="playlist cover" size={160} />
              </Container>
              <VStack space={2}>
                <Button onPress={handleSpotifyButtonPress} flex={1} ml={2} p={3} bgColor={'#1DB954'} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center" flex={1}>
                    <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'25px'} />
                    <Text color={'black'} fontWeight={'medium'}>View on Spotify</Text>
                  </HStack>
                </Button>
                <Button onPress={() => overridePlaylist(selectedPlaylist, tracks)} flex={1} ml={2} p={3} bgColor={'#e53e3e'} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center">
                    <Icon name="edit" size={20} color="white" />
                    <Text color={'white'} fontWeight={'medium'}>Override Playlist</Text>
                  </HStack>
                </Button>
                <Button onPress={() => createNewPlaylist(selectedPlaylist, tracks)} variant={'outline'} flex={1} ml={2} p={3} _pressed={{
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
        </Animated.View>

        {/* Sorter selection */}
        <Animated.View
          style={{
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <HStack mb={3} mt={5} alignItems={'center'}>
            <Select
              selectedValue={sorter}
              size={'lg'}
              flex={1}
              _item={{
                fontWeight: '800',
                paddingTop: 1.5,
                paddingBottom: 1.5,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 'md',
              }}
              
              onValueChange={handleSorterChange}
              placeholder="Sort by"
              variant='filled'
              bgColor={'white'}
              fontWeight={'medium'}
              dropdownIcon={<Icon name="sort" size={20} color={'#5e5e5e'} style={{ marginRight: 10 }} />}
            >
              {Object.keys(sorterOptions).map((option, index) => (
                <Select.Item key={index} label={option} value={sorterOptions[option]} />
              ))}
            </Select>
            {/* Asc/Desc button */}
            <Button onPress={toggleSortDirection} variant={'solid'} ml={1} size={'xs'} bgColor={'white'} _pressed={{
              opacity: 0.5,
            }}>
              {getSortIcon()}
            </Button>
          </HStack>
          {/* Tracks */}
          {tracks ? (
            <TracksList tracks={tracks} spotifyLogo={spotifyLogo} scrollY={scrollY} />

          ) : (
            <Center p={20}>
              <Spinner accessibilityLabel="Loading tracks" color={'grey'} />
            </Center>
          )}
        </Animated.View>


      </Flex>
    </>

  );
}

export default React.memo(PlaylistEditor);
