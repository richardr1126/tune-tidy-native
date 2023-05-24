import React, { useEffect, useState, useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, clear } from '../../utils/asyncStorage';
import TopArtists from './tabs/TopArtists';
import TopTracks from './tabs/TopTracks';
import TopAlbums from './tabs/TopAlbums';
import PlaylistRouter from './tabs/PlaylistRouter';

import Icon from 'react-native-vector-icons/FontAwesome5';

// Create a bottom tab navigator
const Tab = createMaterialTopTabNavigator();
const spotify = new SpotifyWebApi();

// Define the main tabs component
export default function Main({ navigation }) {
  const [user, setUser] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
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

  const setAccessToken = async () => {
    const token = await getData('token');
    console.log('token is: ', token);
    spotify.setAccessToken(token);
    return token;
  }

  const redirectLogin = () => {
    clear();
    navigation.navigate('Landing');
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



  useEffect(() => {
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

      } catch (error) {
        console.log("Error fetching data:", error);
        redirectLogin();
      }
    }

    fetchData();

  }, []);


  const dataFetched = useMemo(() => (
    user &&
    playlistData &&
    topArtists.short_term &&
    topArtists.medium_term &&
    topArtists.long_term &&
    topTracks.short_term &&
    topTracks.medium_term &&
    topTracks.long_term
  ), [user, playlistData, topArtists, topTracks]);



  if (dataFetched) return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 0.15, elevation: 1, shadowOpacity: 1, paddingTop: 0, paddingTop: 0, paddingBottom: 0 },
        headerShown: false,
        swipeEnabled: true,
        lazy: true,
        tabBarIconStyle: { justifyContent: 'center', alignItems: 'center' },
        tabBarIndicatorStyle: { backgroundColor: '#1DB954' },
        tabBarLabelStyle: { fontSize: 10 }, // adjust size of label
      }}
      tabBarPosition='bottom'
    >
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
      <Tab.Screen
        name="Sorter"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="edit" color={color} size={20} />
          ),
        }}
      >
        {props => <PlaylistRouter {...props} user={user} playlistData={playlistData} />}
      </Tab.Screen>


    </Tab.Navigator>
  );
};