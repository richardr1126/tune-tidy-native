import { useEffect, useState, memo, useRef } from 'react';
import {
  VStack,
  HStack,
  Button,
  Image,
  Container,
  Text,
  Center,
  Flex,
  Select,
  useToast,
} from "native-base";
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Linking from 'expo-linking';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData } from '../../../../utils/asyncStorage';

import spotifyLogo from '../../../../assets/Spotify_Icon_CMYK_Black.png';
import TracksList from './TracksList';
import { Sorters } from '../../../../utils/Sorter';
import Header from './Header';
import { trigger } from 'react-native-haptic-feedback';
import LoadingModal from './LoadingModal';

const spotify = new SpotifyWebApi();

function PlaylistEditor({ user, route, navigation }) {
  const [sorter, setSorter] = useState('original_position');
  const [sorterDirection, setSorterDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const selectedPlaylist = route.params.selectedPlaylist;
  const toast = useToast();

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

  const iconOptions = {
    'Original Position': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Name': { 'asc': 'sort-alpha-down', 'desc': 'sort-alpha-down-alt'},
    'Album Name': { 'asc': 'sort-alpha-down', 'desc': 'sort-alpha-down-alt'},
    'Artist Name': { 'asc': 'sort-alpha-down', 'desc': 'sort-alpha-down-alt'},
    'Release Date': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Popularity': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Date Added': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Tempo': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Acousticness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Danceability': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Energy': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Instrumentalness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Liveness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Loudness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Speechiness': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
    'Valence': { 'asc': 'sort-numeric-down', 'desc': 'sort-numeric-down-alt'},
  };

  const iconOptionsLeft = {
    'Original Position': 'hashtag',
    'Name': 'list-ol',
    'Album Name': 'compact-disc',
    'Artist Name': 'user',
    'Release Date': 'calendar-alt',
    'Popularity': 'fire',
    'Date Added': 'calendar-plus',
    'Tempo': 'tachometer-alt',
    'Acousticness': 'wave-square',
    'Danceability': 'walking',
    'Energy': 'bolt',
    'Instrumentalness': 'guitar',
    'Liveness': 'microphone-alt',
    'Loudness': 'volume-up',
    'Speechiness': 'comment-alt',
    'Valence': 'heart',
  };


  const sorterDirections = {
    'asc': 'Ascending',
    'desc': 'Descending',
  };

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  const toggleSortDirection = () => {
    trigger('impactLight');
    if (sorterDirection === 'asc') {
      setSorterDirection('desc');
      setTracks(tracks.reverse());
      toast.show({
        title: 'Sorting by ' + getKeyByValue(sorterOptions, sorter) + ' - Descending',
        placement: 'bottom',
        duration: 2666,
      });
    } else {
      setSorterDirection('asc');
      setTracks(tracks.reverse());
      toast.show({
        title: 'Sorting by ' + getKeyByValue(sorterOptions, sorter) + ' - Ascending',
        placement: 'bottom',
        duration: 2666,
      });
    }
  }

  const handleSorterChange = (value) => {
    setSorter(value);
    trigger('impactLight');
    toast.show({
      title: 'Sorting by ' + getKeyByValue(sorterOptions, value) + ' - ' + sorterDirections[sorterDirection],
      placement: 'bottom',
      duration: 2666,
    });
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
    trigger('impactLight');
    //setSelectedPlaylist(null);
    navigation.navigate('Playlist Selector');
    //setTracks(null);
    setSorter('original_position');

  }

  const handleSpotifyButtonPress = () => {
    trigger('impactLight');
    Linking.openURL(selectedPlaylist.external_urls.spotify);
  }

  const redirectLogin = () => {
    //clear();
    trigger('notificationError');
    navigation.goBack();
    navigation.navigate('Landing');
  }

  const checkTokenExpiration = async () => {
    const tokenExpiration = await getData('tokenExpiration');
    if (tokenExpiration !== null) {
      //check if token will expire in next 15 minutes
      if (Date.now() > tokenExpiration - 900000) {
        console.log('tokenExpiration is expired, getting a new one');
        redirectLogin();
        return false;
      } else {
        return true;
      }
    }
  }

  const setAccessToken = async () => {
    if (await checkTokenExpiration()) {
      const token = await getData('token');
      console.log('token is: ', token);
      spotify.setAccessToken(token);
      return token;
    } else {
      return null;
    }
  }

  // A function to fetch user's top tracks using Spotify Web API
  const fetchPlaylistTracks = async () => {
    if (await setAccessToken() === null) {
      return;
    }
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
        //console.log(combinedTracks);
        //trigger('notificationSuccess');
        setTracks(combinedTracks);
        toast.show({
          title: 'Tracks fetched',
          placement: 'bottom',
          duration: 2666,
        });
        setRefreshing(false);

      })
      .catch((error) => {
        console.log("Error fetching tracks from playlist:", error);
        redirectLogin();
      });
  }

  const overridePlaylist = async (playlist, tracks) => {
    if (await setAccessToken() === null) {
      return;
    }
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

    toast.show({
      title: 'Sorted playlist successfully overridden',
      placement: 'bottom',
      duration: 2666,
    });
  }

  // Creates a new playlist with the same name as the original playlist, but with "(Tune Tidy)" appended to the end
  const createNewPlaylist = async (playlist, tracks) => {
    if (await setAccessToken() === null) {
      return;
    }
    spotify.createPlaylist(playlist.owner.id, {
      name: playlist.name + " - Sorted",
      description: playlist.description + (playlist.description ? ". " : "") + "Sorted by " + getKeyByValue(sorterOptions, sorter) + " - " + sorterDirections[sorterDirection],
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
    trigger('notificationSuccess');
    toast.show({
      title: 'Sorted playlist successfully copied',
      placement: 'bottom',
      duration: 2666,
    });
  }

  // Add this in your PlaylistEditor component
  const scrollY = useRef(new Animated.Value(0)).current;
  // In your PlaylistEditor component
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -300],
    extrapolate: 'clamp', // This will prevent the value from going beyond the output range
  });
  // Define another translateY animation for the rest of the content
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 182],
    outputRange: [0, -182],
    extrapolate: 'clamp',
  });


  const handleOverrideButtonPress = () => {
    trigger('impactLight');
    setLoading(true);
    // await overridePlaylist(selectedPlaylist, tracks);
  }

  const handleCopyButtonPress = async () => {
    trigger('impactLight');
    await createNewPlaylist(selectedPlaylist, tracks);
  }

  useEffect(() => {
    const asyncLoader = async () => {
      if (loading) {
        await overridePlaylist(selectedPlaylist, tracks);
        setLoading(false);
        setProgress(0);
      }
    }
    asyncLoader();
  }, [loading]);

  useEffect(() => {
    const asyncLoader = async () => {
      if (refreshing) {
        try {
          await fetchPlaylistTracks();

        } catch (error) {
          console.log("Error fetching tracks:", error);
          redirectLogin();
        }


      }
    }
    asyncLoader();
  }, [refreshing]);

  useEffect(() => {
    if (!tracks) {
      setRefreshing(true);
    }
  }, []);


  return (
    <>
      <LoadingModal isOpen={loading} progress={progress} />
      <Header text={selectedPlaylist.name} handleBackButtonPress={handleBackButtonPress} />
      <Flex mt={'90px'} mb={'25px'} mx={'25px'}>
        <Animated.View
          style={{
            transform: [{ translateY: headerTranslateY }],
          }}
          zIndex={0}
        >
          <Center>
            <HStack mt={5} alignItems="center">
              <Container>
                <Image borderRadius={'sm'} source={{ uri: selectedPlaylist.images[0].url }} alt="playlist cover" size={160} />
              </Container>
              <VStack space={2}>
                <Button borderRadius={'lg'} onPress={handleSpotifyButtonPress} flex={1} ml={2} p={3} bgColor={'#1DB954'} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center" flex={1}>
                    <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'25px'} />
                    <Text color={'black'} fontWeight={'medium'}>View on Spotify</Text>
                  </HStack>
                </Button>
                <Button borderRadius={'lg'} onPress={handleOverrideButtonPress} flex={1} ml={2} p={3} bgColor={'#e53e3e'} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center">
                    <Icon name="edit" size={20} color="white" />
                    <Text color={'white'} fontWeight={'medium'}>Override Playlist</Text>
                  </HStack>
                </Button>
                <Button borderRadius={'lg'} onPress={handleCopyButtonPress} variant={'outline'} flex={1} ml={2} p={3} _pressed={{
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
          <HStack mb={1} mt={4} alignItems={'center'}>
            <Select
              selectedValue={sorter}
              size={'lg'}
              flex={1}
              _item={{
                paddingTop: 1.5,
                paddingBottom: 1.5,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 'md',
                justifyContent: 'center',
              }}
              borderRadius={'md'}
              onOpen={() => trigger('impactLight')}
              onValueChange={handleSorterChange}
              placeholder="Sort by"
              variant='filled'
              bgColor={'white'}
              fontWeight={'medium'}
              dropdownIcon={<Icon name={iconOptionsLeft[getKeyByValue(sorterOptions, sorter)]} size={20} color={'#5e5e5e'} style={{ marginRight: 10 }} />}
            >
              {Object.keys(sorterOptions).map((option, index) => (
                <Select.Item
                  rightIcon={<Icon name={iconOptions[option][sorterDirection]} size={20} color={'#5e5e5e'} style={{ marginLeft: 'auto' }} />}
                  leftIcon={<Icon name={iconOptionsLeft[option]} size={20} color={'#5e5e5e'} />}
                  key={index}
                  label={option}
                  _text={{fontWeight: 'medium'}}
                  value={sorterOptions[option]}
                />
              ))}
            </Select>
            {/* Asc/Desc button */}
            <Button onPress={toggleSortDirection} variant={'solid'} ml={1} size={'xs'} bgColor={'white'} borderRadius={'md'} _pressed={{
              opacity: 0.5,
            }}>
              <Icon name={iconOptions[getKeyByValue(sorterOptions, sorter)][sorterDirection]} size={20} color={'#5e5e5e'} />
            </Button>
          </HStack>
          {/* Tracks */}

          <TracksList refreshing={refreshing} setRefreshing={setRefreshing} tracks={tracks} spotifyLogo={spotifyLogo} scrollY={scrollY} />
        </Animated.View>


      </Flex>
    </>

  );
}

export default memo(PlaylistEditor);
