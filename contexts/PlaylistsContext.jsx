import React, { createContext, useContext } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData } from '~/utils/asyncStorage';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const spotify = new SpotifyWebApi();
const PlaylistContext = createContext();

export const usePlaylists = () => useContext(PlaylistContext);

export const PlaylistsProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const fetchPlaylists = async () => {
    const playlists = [];
  
    const storedToken = await getData('token2');
    if (!storedToken) {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      return [];
    }

    try {
      spotify.setAccessToken(storedToken);
    } catch (error) {
      console.log('Error setting access token:', error);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      return [];
    }
  
    
    let limit = 50;
    let offset = 0;
    let response = await spotify.getUserPlaylists({ limit, offset });

  
    while (response.items.length > 0) {
      playlists.push(...response.items);
      offset += limit;
      response = await spotify.getUserPlaylists({ limit, offset });
    }
  
    return playlists;
  };
  
  const { data: playlists, isPending, isRefetching, isError } = useQuery({
    queryKey: ['playlists'],
    queryFn: fetchPlaylists,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour
  });

  return (
    <PlaylistContext.Provider value={{ playlists, isPending, isRefetching, isError }}>
      {children}
    </PlaylistContext.Provider>
  );
};