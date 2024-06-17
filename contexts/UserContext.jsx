import React, { createContext, useContext, useEffect } from 'react';
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
    const body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CLIENT_ID}`;

    try {
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
      spotify.setAccessToken(data.access_token);
      console.log('Access token refreshed');
      return data.access_token;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const { data: accessToken, isRefetching: isTokenRefreshing, isError: isTokenError } = useQuery({
    queryKey: ['accessToken'],
    queryFn: async () => {
      const storedToken = await getData('token2');

      if (storedToken) {
        try {
          spotify.setAccessToken(storedToken);
          await spotify.getMe();
          console.log('Access token set without refreshing');
          return storedToken;
        } catch (error) {
          console.log('Need to refresh token');
          const newToken = await refreshAccessToken();
          return newToken;
        }
      } else {
        router.push('/landing');
        return null;
      }
    },
    staleTime: 3000000,
    cacheTime: 3000000,
    refetchInterval: 3000000,
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      spotify.setAccessToken(accessToken);
      const userData = await spotify.getMe();
      console.log('User data fetched');
      return userData;
    },
    enabled: !!accessToken,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchInterval: Infinity,
  });

  useEffect(() => {
    if (isTokenError) {
      router.push('/landing');
    }
  }, [isTokenError]);

  async function logout() {
    await clear();
    await queryClient.invalidateQueries();
    router.push('/landing');
  }

  return (
    <UserContext.Provider value={{ spotify, user, logout, accessToken, isTokenRefreshing }}>
      {children}
    </UserContext.Provider>
  );
};