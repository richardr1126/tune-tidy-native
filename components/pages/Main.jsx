import { useEffect, useState, useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, storeData } from '../../utils/asyncStorage';
import TopArtists from './tabs/TopArtists';
import TopTracks from './tabs/TopTracks';
import TopAlbums from './tabs/TopAlbums';
import PlaylistRouter from './tabs/PlaylistRouter';
import {REACT_APP_SPOTIFY_CLIENT_ID} from '@env';
import { useColorModeValue } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { useToast } from 'native-base';

// Create a bottom tab navigator
const Tab = createMaterialTopTabNavigator();
const spotify = new SpotifyWebApi();

// Define the main tabs component
export default function Main({ navigation }) {
  const bgColor = useColorModeValue('#f2f2f2', 'black');
  const borderColor = useColorModeValue('#e5e5e5', '#1e1e1e');
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [topArtists, setTopArtists] = useState({
    short_term: null,
    medium_term: null,
    long_term: null,
  });
  const [topTracks, setTopTracks] = useState({
    short_term: null,
    medium_term: null,
    long_term: null,
  });
  const CLIENT_ID = REACT_APP_SPOTIFY_CLIENT_ID;
  

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

  const errorFetching = () => {
    //clear();
    //navigation.navigate('Landing');
    setAccessToken();
  }

  const extractArtistData = (artist) => ({
    name: artist.name,
    image: artist.images[0].url,
    id: artist.id,
    url: artist.external_urls.spotify,
  });

  const extractTrackData = (track) => ({
    name: track.name,
    artists: track.artists.map((artist) => artist.name).join(', '),
    image: track.album.images[0].url,
    id: track.id,
    url: track.external_urls.spotify,
    albumName: track.album.name,
    albumId: track.album.id,
    albumTotalTracks: track.album.total_tracks,
    albumArtists: track.album.artists.map((artist) => artist.name).join(', '),
  });

  const fetchData = async () => {
    try {
      await setAccessToken();
      const userData = await spotify.getMe();
      let playlistData = await spotify.getUserPlaylists({ limit: 50 });

      if (playlistData.total === 50) {
        const data2 = await spotify.getUserPlaylists({ limit: 50, offset: 50 });
        const combinedData = playlistData.items.concat(data2.items);
        playlistData.items = combinedData;
      }

      setPlaylistData(playlistData);
      setUser(userData);

      const shortTermArtists = await spotify.getMyTopArtists({ time_range: 'short_term', limit: 50 });
      const mediumTermArtists = await spotify.getMyTopArtists({ time_range: 'medium_term', limit: 50 });
      const longTermArtists = await spotify.getMyTopArtists({ time_range: 'long_term', limit: 50 });

      const shortTermTracks = await spotify.getMyTopTracks({ time_range: 'short_term', limit: 50 });
      const mediumTermTracks = await spotify.getMyTopTracks({ time_range: 'medium_term', limit: 50 });
      const longTermTracks = await spotify.getMyTopTracks({ time_range: 'long_term', limit: 50 });

      setTopArtists({
        short_term: { items: shortTermArtists.items.map(extractArtistData) },
        medium_term: { items: mediumTermArtists.items.map(extractArtistData) },
        long_term: { items: longTermArtists.items.map(extractArtistData) },
      });

      setTopTracks({
        short_term: { items: shortTermTracks.items.map(extractTrackData) },
        medium_term: { items: mediumTermTracks.items.map(extractTrackData) },
        long_term: { items: longTermTracks.items.map(extractTrackData) },
      });

      setRefreshing(false);
      toast.closeAll();
      if (!toast.isActive('spotifySynced')) {
        toast.show({
          id: 'spotifySynced',
          title: "Synced with Spotify",
          placement: 'top',
          duration: 300,
        });
      }
      // setTimeout(() => {
      //   toast.close('spotifySynced');
      // }, 5000);

    } catch (error) {
      console.log("Error fetching data:", error);
      errorFetching();
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      setRefreshing(true);
    }
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchData();
    }
  }, [refreshing]);


  const dataFetched = useMemo(() => (
    user &&
    playlistData &&
    topArtists.short_term &&
    topArtists.medium_term &&
    topArtists.long_term &&
    topTracks.short_term &&
    topTracks.medium_term &&
    topTracks.long_term
  ), [user]);


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: { backgroundColor: bgColor, borderTopWidth: 1, borderColor: borderColor, elevation: 1, shadowOpacity: 1, paddingTop: 0, paddingTop: 0, paddingBottom: 9 },
        headerShown: false,
        swipeEnabled: true,
        lazy: true,
        tabBarIconStyle: { justifyContent: 'center', alignItems: 'center' },
        tabBarIndicatorStyle: { backgroundColor: '#1DB954' },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '700' },
      }}
      sceneContainerStyle={{ backgroundColor: bgColor }}
      tabBarPosition='bottom'
      initialRouteName='Sorter'
    >
      <Tab.Screen
        name="Sorter"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="edit" color={color} size={20} />
          ),
        }}
      >
        {props => <PlaylistRouter {...props} rootNavigator={navigation} user={user} playlistData={playlistData} refreshing={refreshing} setRefreshing={setRefreshing} />}
      </Tab.Screen>
      <Tab.Screen
        name="Artists"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="users" color={color} size={20} />
          ),
        }}
      >
        {props => <TopArtists {...props} topArtists={topArtists} />}
      </Tab.Screen>
      <Tab.Screen
        name="Tracks"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="list-ol" color={color} size={20} />
          ),
        }}
      >
        {props => <TopTracks {...props} topTracks={topTracks} />}
      </Tab.Screen>
      <Tab.Screen
        name="Albums"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="compact-disc" color={color} size={20} />
          ),
        }}
      >
        {props => <TopAlbums {...props} topTracks={topTracks} />}
      </Tab.Screen>



    </Tab.Navigator>
  );
};