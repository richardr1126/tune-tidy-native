import { useEffect, memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { REACT_APP_SPOTIFY_CLIENT_ID } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as WebBrowser from 'expo-web-browser';
import { storeData, getData } from '../../utils/asyncStorage';
import { useToast } from 'native-base';
import pkceChallenge from 'react-native-pkce-challenge';


function LandingPage({ navigation }) {
  // Add your CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE, and SCOPES here
  const CLIENT_ID = REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = 'com.tunetidy.native:/';
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "code";
  const SCOPES = [
    "user-read-private",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-top-read",
    "ugc-image-upload"
  ].join("%20");
  const toast = useToast();

  const handleLoginButtonPress = async () => {
    toast.closeAll();
    const { codeChallenge, codeVerifier } = pkceChallenge();

    // Save the codeVerifier in storage
    await storeData('codeVerifier', codeVerifier);

    const result = await WebBrowser.openAuthSessionAsync(
      `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}&code_challenge=${codeChallenge}&code_challenge_method=S256`,
      REDIRECT_URI
    );
    

    if (result.type === 'success') {
      const authCode = new URL(result.url).searchParams.get('code');
      const codeVerifierFromStorage = await getData('codeVerifier');

      let body = `grant_type=authorization_code&code=${authCode}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&code_verifier=${codeVerifierFromStorage}`;

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      })
        .then(response => {
          if (!response.ok) {
            response.text().then(text => {
              console.error(`HTTP status ${response.status}. Message: ${text}`);
            });
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(async data => {
          console.log(data);
          const token = data.access_token;
          // const tokenExpiration = JSON.stringify(Date.now() + data.expires_in * 1000);
          const tokenExpiration = JSON.stringify(Date.now() + 2700000);
          await storeData('token2', token);
          await storeData('refreshToken', data.refresh_token);
          await storeData('tokenExpiration2', tokenExpiration);
          navigation.navigate('Main');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };


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
      // console.log(await getData('token'));
      // console.log(await getData('tokenExpiration'));
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const checkTokenExpiration = async () => {
    const tokenExpiration = await getData('tokenExpiration2');
    if (tokenExpiration !== null) {
      if (Date.now() > tokenExpiration) {
        console.log('tokenExpiration is expired, refreshing');
        refreshAccessToken();
      }
    }
  };  

  useEffect(() => {
    // If tokenExpiration is not null, automatically call handleLoginButtonPress
    // to refresh the token if it has expired
    checkTokenExpiration();
    //check if device is in dark mode

  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/large-logo.png')}
          />
          <Text style={styles.title}>TuneTidy</Text>
        </View>
        <Text style={styles.subtitle}>
          Spotify Playlist Sorter and Stats Viewer
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to TuneTidy!</Text>
          <View style={styles.listContainer}>
            <View style={{ ...styles.listItem, marginBottom: 20 }}>
              <Text style={styles.listText}>
                Completely free to use, no ads, and no data collection.
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
                Access your most frequently played tracks, artists, and albums for three different time periods. Your data is refreshed about once a day.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Icon name="magic" size={24} style={styles.listIcon} />
              <Text style={styles.listText}>
                Generate AI Playlist Covers for your playlists by describing your new playlist cover with as much detail as possible.
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
            source={require('../../assets/Spotify_Logo_CMYK_Black.png')}
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
    paddingTop: 5,
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
    marginTop: 1,
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

export default memo(LandingPage);