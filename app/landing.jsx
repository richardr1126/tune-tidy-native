import { Image, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import pkceChallenge from 'react-native-pkce-challenge';
import { getData, storeData } from '~/utils/asyncStorage';

// icons
import { SortDesc } from '~/lib/icons/SortDesc';
import { Clipboard } from '~/lib/icons/Clipboard';
import { Sparkles } from '~/lib/icons/Magic';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';


export default function Landing() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
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

  const handleLoginButtonPress = async () => {
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
          
          queryClient.invalidateQueries('user');
          router.back();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <View className='px-5 flex-1 justify-center bg-secondary/30'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Welcome to TuneTidy!</CardTitle>
          <CardDescription>Completely free to use, no ads, and no data collection.</CardDescription>
        </CardHeader>
        <CardContent className='gap-y-4'>
          <View className='flex-row justify-between items-center gap-x-4'>
            <SortDesc className='color-primary' />
            <Text className='flex-1'>
              Sort your playlists by artist, album, track name, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, or valence.
            </Text>
          </View>
          <View className='flex-row justify-between items-center gap-x-4'>
            <Clipboard className='color-primary' />
            <Text className='flex-1'>
              Access your most frequently played tracks, artists, and albums for three different time periods.
            </Text>
          </View>
          <View className='flex-row justify-between items-center gap-x-4'>
            <Sparkles className='color-primary' />
            <Text className='flex-1'>
              Generate AI playlist cover art for your playlists using Dalle 3 (powered by OpenAI). Then save directly to your Spotify playlist.
            </Text>
          </View>
        </CardContent>

        <CardFooter className='justify-center'>
          <Button
            className='flex-1 flex-row items-center justify-center mt-1 p-3 bg-[#1DB954] rounded-lg'
            onPress={handleLoginButtonPress}
          >
            <Text className='text-lg font-semibold text-color-black'>Login with</Text>
            <View className='flex'>
              <Image
                style={{
                  width: 80,
                  height: 25,
                  marginLeft: 5,
                  resizeMode: 'contain',
                }}
                source={{ uri: 'https://storage.googleapis.com/spotify-newsroom-staging.appspot.com/1/2021/02/Spotify_Logo_RGB_Black.png' }}
              />
            </View>

          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
