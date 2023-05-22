import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, clear } from '../utils/asyncStorage';
import TopArtists from './TopArtists';
import TopTracks from './TopTracks';
import TopAlbums from './TopAlbums';

import Icon from 'react-native-vector-icons/FontAwesome5';

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();
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

  useEffect(() => {
    setAccessToken().then(() => {
      // Fetch user and initial playlists data
      const userData = spotify.getMe();
      const playlistData = spotify.getUserPlaylists({ limit: 50 });
  
      Promise.all([userData, playlistData])
        .then(([user, data]) => {
          // Set user data in state
          setUser(user);
          console.log(user);
  
          if (data.total === 50) { 
            // If there are more than 50 playlists, fetch the remaining playlists
            return spotify.getUserPlaylists({ limit: 50, offset: 50 })
              .then((data2) => {
                console.log('More playlists: ', data2);
                // Combine data and data2 to get all playlists
                const combinedData = data.items.concat(data2.items);
                data.items = combinedData;
                return data; // Return data for the next step
              });
          } else {
            // If there are less than 50 playlists, return data as is
            return data;
          }
        })
        .then((playlistData) => {
          // Set playlist data in state
          setPlaylistData(playlistData);
    
          // Fetch the top artists
          const shortTermArtists = spotify.getMyTopArtists({ time_range: 'short_term', limit: 50 });
          const mediumTermArtists = spotify.getMyTopArtists({ time_range: 'medium_term', limit: 50 });
          const longTermArtists = spotify.getMyTopArtists({ time_range: 'long_term', limit: 50 });
          //Fetch the top tracks
          const shortTermTracks = spotify.getMyTopTracks({ time_range: 'short_term', limit: 50 });
          const mediumTermTracks = spotify.getMyTopTracks({ time_range: 'medium_term', limit: 50 });
          const longTermTracks = spotify.getMyTopTracks({ time_range: 'long_term', limit: 50 });
    
          return Promise.all([shortTermArtists, mediumTermArtists, longTermArtists, shortTermTracks, mediumTermTracks, longTermTracks]);
        })
        .then(([shortTermArtists, mediumTermArtists, longTermArtists, shortTermTracks, mediumTermTracks, longTermTracks]) => {
          // Reduce the top artists data to only the artist names, images, ids, and urls
          shortTermArtists.items = shortTermArtists.items.map((artist) => {
            return {
              name: artist.name,
              image: artist.images[0].url,
              id: artist.id,
              url: artist.external_urls.spotify,
            };
          });
          mediumTermArtists.items = mediumTermArtists.items.map((artist) => {
            return {
              name: artist.name,
              image: artist.images[0].url,
              id: artist.id,
              url: artist.external_urls.spotify,
            };
          });
          longTermArtists.items = longTermArtists.items.map((artist) => {
            return {
              name: artist.name,
              image: artist.images[0].url,
              id: artist.id,
              url: artist.external_urls.spotify,
            };
          });
          // Reduce the top tracks data to only the track names, artists, images, ids, and urls
          shortTermTracks.items = shortTermTracks.items.map((track) => {
            return {
              name: track.name,
              artists: track.artists.map((artist) => artist.name).join(', '),
              image: track.album.images[0].url,
              id: track.id,
              url: track.external_urls.spotify,
              albumName: track.album.name,
              albumId: track.album.id,
              albumTotalTracks: track.album.total_tracks,
              albumArtists: track.album.artists.map((artist) => artist.name).join(', '),
            };
          });
          mediumTermTracks.items = mediumTermTracks.items.map((track) => {
            return {
              name: track.name,
              artists: track.artists.map((artist) => artist.name).join(', '),
              image: track.album.images[0].url,
              id: track.id,
              url: track.external_urls.spotify,
              albumName: track.album.name,
              albumId: track.album.id,
              albumTotalTracks: track.album.total_tracks,
              albumArtists: track.album.artists.map((artist) => artist.name).join(', '),
            };
          });
          longTermTracks.items = longTermTracks.items.map((track) => {
            return {
              name: track.name,
              artists: track.artists.map((artist) => artist.name).join(', '),
              image: track.album.images[0].url,
              id: track.id,
              url: track.external_urls.spotify,
              albumName: track.album.name,
              albumId: track.album.id,
              albumTotalTracks: track.album.total_tracks,
              albumArtists: track.album.artists.map((artist) => artist.name).join(', '),
            };
          });

          
          // Set top artists data in state
          setTopArtists({
            short_term: shortTermArtists,
            medium_term: mediumTermArtists,
            long_term: longTermArtists,
          });
          setTopTracks({
            short_term: shortTermTracks,
            medium_term: mediumTermTracks,
            long_term: longTermTracks,
          });
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
          // If there's an error, redirect user to login page
          redirectLogin();
        });
    });
  }, []);
  
  const checkDataFetched = () => {
    if (user && playlistData && topArtists.short_term && topArtists.medium_term && topArtists.long_term && topTracks.short_term && topTracks.medium_term && topTracks.long_term) {
      return true;
    } else {
      return false;
    }
  }


  if (checkDataFetched) return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#1DB954', tabBarInactiveTintColor: 'grey', tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 0, elevation: 0, shadowOpacity: 0, paddingTop: 10 }, headerShown: false }}>
      <Tab.Screen
        name="Top Artists"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" color={color} size={size} />
          ),
        }}
      >
        {props => <TopArtists {...props} topArtists={topArtists} />}
      </Tab.Screen>
      <Tab.Screen
        name="Top Tracks"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-ol" color={color} size={size} />
          ),
        }}
      >
        {props => <TopTracks {...props} topTracks={topTracks} />}
      </Tab.Screen>
      <Tab.Screen
        name="Top Albums"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="compact-disc" color={color} size={size} />
          ),
        }}
      >
        {props => <TopAlbums {...props} topTracks={topTracks} />}
      </Tab.Screen>

    </Tab.Navigator>
  );
};