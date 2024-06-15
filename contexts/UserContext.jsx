import React, { createContext, useContext } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { clear, getData, storeData } from '~/utils/asyncStorage';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const spotify = new SpotifyWebApi();
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
  const router = useRouter();
  const queryClient = useQueryClient();


  const refreshAccessToken = async () => {
    const refreshToken = await getData('refreshToken');
  
    // Prepare the request body
    const body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CLIENT_ID}`;
  
    try {
      // Fetch the new access token
      console.log('Fetching new access token');
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
  
      await storeData('token2', data.access_token);
      await storeData('refreshToken', data.refresh_token);
  
      return data.access_token;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      let storedToken = await getData('token2');

      if (storedToken) {
        try {
          spotify.setAccessToken(storedToken);
          const userData = await spotify.getMe();
          console.log('Access token set');
          return userData;
        } catch (error) {
          
          // Refresh the access token
          storedToken = await refreshAccessToken();
          spotify.setAccessToken(storedToken);
          const userData = await spotify.getMe();
          console.log('Access token refreshed');
          
          return userData;
        }
      } else {
        router.push('/landing');
        return null;
      }
    },
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour
  });



  async function logout() {
    await clear();
    await queryClient.invalidateQueries();
  }

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};