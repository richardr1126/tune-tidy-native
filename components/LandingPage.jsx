import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { REACT_APP_NODE_ENV, REACT_APP_SPOTIFY_CLIENT_ID, REACT_APP_SPOTIFY_CLIENT_SECRET } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Linking from 'expo-linking'
import { storeData, getData } from '../utils/asyncStorage';

function LandingPage({ navigation }) {
  // Add your CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE, and SCOPES here
  const CLIENT_ID = REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = REACT_APP_NODE_ENV === 'dev'
    ? 'exp://192.168.0.25:19000'
    : Linking.createURL();
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = [
    "user-read-private",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-top-read",
  ].join("%20");

  const handleLoginButtonPress = async () => {
    //console.log(REDIRECT_URI);
    Linking.openURL(`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`);
    Linking.addEventListener('url', async (event) => {
      //console.log(event.url);
      const token = event.url.split('#')[1].split('&')[0].split('=')[1];
      const tokenExpiration = JSON.stringify(Date.now() + 3600000);
      await storeData('token', token);
      await storeData('tokenExpiration', tokenExpiration);
      console.log(await getData('token'));
      console.log(await getData('tokenExpiration'));
      navigation.navigate('Main');
    });

  };

  const checkTokenExpiration = async () => {
    const tokenExpiration = await getData('tokenExpiration');
    if (tokenExpiration !== null) {
      if (Date.now() > tokenExpiration) {
        console.log('tokenExpiration is expired, getting a new one');
        handleLoginButtonPress();
      }
    }
  }

  useEffect(() => {
    // If tokenExpiration is not null, automatically call handleLoginButtonPress
    // to refresh the token if it has expired
    checkTokenExpiration();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/large-logo.png')}
          />
          <Text style={styles.title}>TuneTidy</Text>
        </View>
        <Text style={styles.subtitle}>
          Spotify Playlist Sorter and Music Manager
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to TuneTidy!</Text>
          <View style={styles.listContainer}>
            <View style={{ ...styles.listItem, marginBottom: 20 }}>
              <Text style={styles.listText}>
                Completely free to use, no ads, no data collection, no tracking, no cookies, no analytics, no selling your data.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Icon name="sort-amount-desc" size={24} style={styles.listIcon} />
              <Text style={styles.listText}>
                Sort your playlists by artist, album, track name, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, or valence.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Icon name="clipboard" size={24} style={styles.listIcon} />
              <Text style={styles.listText}>
                Access your most frequently played tracks, artists, albums, and genres for three different time periods. Your data is refreshed about once a day.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Icon name="arrows-v" size={24} style={styles.listIcon} />
              <Text style={styles.listText}>
                Observe how your rankings evolve over time, represented by arrows in comparison to your previous visit.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginButtonPress}
        >
          <Text style={styles.loginButtonText}>Login with</Text>
          <Image
            style={styles.spotifyLogo}
            source={require('../assets/Spotify_Logo_CMYK_Black.png')}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    fontFamily: 'Helvetica Neue',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
  card: {
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1DB954',
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  spotifyLogo: {
    width: 80,
    height: 25,
    marginLeft: 5,
    resizeMode: 'contain',
  },
});

export default LandingPage;