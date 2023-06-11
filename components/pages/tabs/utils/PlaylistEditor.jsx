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
import { trigger } from 'react-native-haptic-feedback';

import spotifyLogo from '../../../../assets/Spotify_Icon_CMYK_Green.png';
import TracksList from './TracksList';
import { Sorters } from '../../../../utils/Sorter';
import Header from './Header';
import LoadingModal from './LoadingModal';
import { getData, storeData } from '../../../../utils/asyncStorage';
import { sorterOptions, sorterDirections, iconOptions, iconOptionsLeft } from '../utils/jsonHelpers';
import { REACT_APP_SPOTIFY_CLIENT_ID } from '@env';

const spotify = new SpotifyWebApi();

function PlaylistEditor({ deviceTheme, route, navigation, rootNavigator }) {
  
  const [sorter, setSorter] = useState('original_position');
  const [sorterDirection, setSorterDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(route.params.selectedPlaylist);
  const user = route.params.user;
  const toast = useToast();
  const CLIENT_ID = REACT_APP_SPOTIFY_CLIENT_ID;

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
        placement: 'top',
        duration: 2000,
      });
    } else {
      setSorterDirection('asc');
      setTracks(tracks.reverse());
      toast.show({
        title: 'Sorting by ' + getKeyByValue(sorterOptions, sorter) + ' - Ascending',
        placement: 'top',
        duration: 2000,
      });
    }
  }

  const handleSorterChange = (value) => {
    trigger('impactLight');
    setSorter(value);
    toast.show({
      title: 'Sorting by ' + getKeyByValue(sorterOptions, value) + ' - ' + sorterDirections[sorterDirection],
      placement: 'top',
      duration: 2000,
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

  const handlePlaylistCoverPress = () => {
    trigger('impactLight');
    const playlist = selectedPlaylist;
    const playlistUser = user;
    rootNavigator.navigate('Cover Image Generator', {
      selectedPlaylist: playlist,
      user: playlistUser,
      setRefreshing: setRefreshing,
    });
  }
    

  const handleBackButtonPress = () => {
    trigger('impactLight');
    setSorter('original_position');
    //setSelectedPlaylist(null);
    navigation.navigate('Playlist Selector');
    //toast.closeAll();
    //setTracks(null);
  }

  const handleSpotifyButtonPress = () => {
    trigger('impactLight');
    Linking.openURL(selectedPlaylist.external_urls.spotify);
  }

  const errorFetching = () => {
    //clear();
    trigger('notificationError');
    // navigation.goBack();
    // navigation.navigate('Landing');
    setAccessToken();
  }

  const refreshAccessToken = async () => {
    const refreshToken = await getData('refreshToken');
  
    // Prepare the request body
    let body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CLIENT_ID}`;
  
    try {
      // Fetch the new access token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });
  
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
  
      const data = await response.json();
  
      const tokenExpiration = JSON.stringify(Date.now() + 2700000);
      await storeData('token2', data.access_token);
      await storeData('tokenExpiration2', tokenExpiration);
      await storeData('refreshToken', data.refresh_token);
      return data.access_token;
      // console.log(await getData('token'));
      // console.log(await getData('tokenExpiration'));
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const setAccessToken = async () => {
    const token = await refreshAccessToken();
    //console.log('token is: ', token);
    spotify.setAccessToken(token);
    return token;
  }

  // A function to fetch user's top tracks using Spotify Web API
  const fetchPlaylistTracks = async () => {
    if (await setAccessToken() === null) {
      return;
    }
    const id = selectedPlaylist.id;
    //console.log('id: ', id);
    spotify.getPlaylist(id).then((data) => {
      //console.log('Fetched playlist');
      setSelectedPlaylist(data);
      //console.log(data);
    }).catch((error) => {
      console.log("Error fetching playlist:", error);
      errorFetching();
    });

    //https://jmperezperez.com/spotify-web-api-js/
    spotify.getPlaylistTracks(id, { limit: 50 })
      .then(async (data) => {
        //console.log('Fetched tracks');
        let combinedTracks = data.items;
        const totalTracks = data.total;

        if (totalTracks > 50) {
          for (let offset = 50; offset < totalTracks; offset += 50) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 150));
              const additionalData = await spotify.getPlaylistTracks(id, { limit: 50, offset });
              //console.log('Fetching more tracks...');
              combinedTracks = combinedTracks.concat(additionalData.items);
            } catch (error) {
              console.log("Error fetching more tracks from playlist:", error);
              errorFetching();
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
        toast.closeAll();
        if (!toast.isActive('tracksFetched')) {
          toast.show({
            id: 'tracksFetched',
            title: 'Tracks fetched',
            placement: 'top',
            duration: 2000,
          });
        }
        setRefreshing(false);
        // setTimeout(() => {
        //   toast.close('tracksFetched');
        // }, 5000);

      })
      .catch((error) => {
        console.log("Error fetching tracks from playlist:", error);
        errorFetching();
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
          errorFetching();
          return;
        }
      }
    }

    setRefreshing(true);

    toast.show({
      title: 'Sorted playlist successfully overridden',
      placement: 'top',
      duration: 2000,
    });
  }

  // Creates a new playlist with the same name as the original playlist, but with "(Tune Tidy)" appended to the end
  const createNewPlaylist = async (user, playlist, tracks) => {
    if (await setAccessToken() === null) {
      return;
    }
    spotify.createPlaylist(user.id, {
      name: playlist.name + " - Sorted",
      description: playlist.description + (playlist.description ? ". " : "") + "Sorted by " + getKeyByValue(sorterOptions, sorter) + " - " + sorterDirections[sorterDirection],
    }).then(async (data) => {
      //console.log(data);
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
        //console.log(trackUris);
        const chunk = await spotify.addTracksToPlaylist(newPlaylistId, trackUris);
        //console.log(chunk);
      }

    }).catch((error) => {
      console.log(error);
      errorFetching();
    });
    trigger('notificationSuccess');
    toast.show({
      title: 'Sorted playlist successfully copied',
      placement: 'top',
      duration: 2000,
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
    await createNewPlaylist(user, selectedPlaylist, tracks);
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
          errorFetching();
        }


      }
    }
    asyncLoader();
  }, [refreshing]);

  const checkViewedInstructions = async () => {
    const viewedInstructions = await getData('viewedInstructions');
    if (!viewedInstructions||viewedInstructions === 'false') {
      rootNavigator.navigate('Instructions');
    }
  }

  useEffect(() => {
    if (!tracks) {
      setRefreshing(true);
    }
    checkViewedInstructions();
  }, []);

  const bgColor = deviceTheme === 'dark' ? 'black' : '#f2f2f2';
  const textColor = deviceTheme === 'dark' ? 'gray.100' : 'black';
  const borderColor = deviceTheme === 'dark' ? '#1e1e1e' : '#e5e5e5';
  const itemColor = deviceTheme === 'dark' ? '#141414' : 'white';


  return (
    <>
      <LoadingModal deviceTheme={deviceTheme} isOpen={loading} progress={progress} />
      <Header deviceTheme={deviceTheme} text={selectedPlaylist.name} handleBackButtonPress={handleBackButtonPress} />
      <Flex pt={'90px'} pb={'25px'} px={'25px'} bgColor={bgColor}>
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
              <VStack space={1.5} ml={1.5}>
                <Button borderRadius={'lg'} onPress={handleSpotifyButtonPress} flex={1} py={'1.5'} px={3} bgColor={'#1DB954'} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center" flex={1}>
                    <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'25px'} />
                    <Text color={'black'} fontWeight={'medium'}>View on Spotify</Text>
                  </HStack>
                </Button>
                <Button borderRadius={'lg'} onPress={handlePlaylistCoverPress} bgColor={'#1769ef'} flex={1} py={'1.5'} px={3} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center">
                    <Icon name="magic" size={20} color="white" />
                    <Text color={'white'} fontWeight={'medium'}>Create Cover Art</Text>
                  </HStack>
                </Button>
                <Button borderRadius={'lg'} onPress={handleOverrideButtonPress} disabled={selectedPlaylist.owner.id !== user.id ? true:false} flex={1} py={'1.5'} px={3} bgColor={'#e53e3e'} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center">
                    <Icon name="edit" size={20} color="white" />
                    <Text color={'white'} fontWeight={'medium'}>Override Playlist</Text>
                  </HStack>
                </Button>
                <Button borderRadius={'lg'} onPress={handleCopyButtonPress} bgColor={itemColor} flex={1} py={'1.5'} px={3} _pressed={{
                  opacity: 0.5,
                }}>
                  <HStack space={1} alignItems="center">
                    <Icon name="copy" size={20} color={deviceTheme === 'dark' ? 'white' : 'black'} />
                    <Text color={textColor} fontWeight={'medium'}>Copy Playlist</Text>
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
                _text: {
                  color: textColor,
                },
              }}
              borderRadius={'md'}
              onOpen={() => trigger('impactLight')}
              onValueChange={handleSorterChange}
              placeholder="Sort by"
              variant='filled'
              bgColor={itemColor}
              borderColor={itemColor}
              color={textColor}
              _actionSheetContent={{bgColor: itemColor}}
              fontWeight={'medium'}
              dropdownIcon={<Icon name={iconOptionsLeft[getKeyByValue(sorterOptions, sorter)]} size={20} color={
                deviceTheme === 'dark' ? 'white' : 'black'
              } style={{ marginRight: 10 }} />}
            >
              {Object.keys(sorterOptions).map((option, index) => (
                <Select.Item
                  rightIcon={<Icon name={iconOptions[option][sorterDirection]} size={20} color={'#5e5e5e'} style={{ marginLeft: 'auto' }} />}
                  leftIcon={<Icon name={iconOptionsLeft[option]} size={20} color={'#5e5e5e'} />}
                  key={index}
                  label={option}
                  bgColor={itemColor}
                  _text={{fontWeight: 'medium'}}
                  value={sorterOptions[option]}
                />
              ))}
            </Select>
            {/* Asc/Desc button */}
            <Button onPress={toggleSortDirection} variant={'solid'} ml={1} size={'xs'} bgColor={itemColor} borderRadius={'md'} _pressed={{
              opacity: 0.5,
            }}>
              <Icon name={iconOptions[getKeyByValue(sorterOptions, sorter)][sorterDirection]} size={20} color={deviceTheme === 'dark' ? 'white' : 'black'} />
            </Button>
          </HStack>
          {/* Tracks */}

          <TracksList deviceTheme={deviceTheme} refreshing={refreshing} setRefreshing={setRefreshing} tracks={tracks} spotifyLogo={spotifyLogo} scrollY={scrollY} />
        </Animated.View>


      </Flex>
    </>

  );
}

export default memo(PlaylistEditor);
