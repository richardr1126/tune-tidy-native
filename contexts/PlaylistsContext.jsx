import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '~/contexts/UserContext';

const PlaylistContext = createContext();

export const usePlaylists = () => useContext(PlaylistContext);

export const PlaylistsProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { spotify, accessToken, isTokenRefreshing } = useUser();

  const fetchPlaylists = async () => {
    const playlists = [];
    let limit = 50;
    let offset = 0;
    let response = await spotify.getUserPlaylists({ limit, offset });

  
    while (response.items.length > 0) {
      playlists.push(...response.items);
      offset += limit;
      response = await spotify.getUserPlaylists({ limit, offset });
    }

    console.log(playlists.length, 'playlists fetched')
  
    return playlists;
  };
  
  const { data: playlists, isPending, isRefetching, isError } = useQuery({
    queryKey: ['playlists'],
    queryFn: fetchPlaylists,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour
    enabled: (!!accessToken) && (!isTokenRefreshing),
  });

  return (
    <PlaylistContext.Provider value={{ playlists, isPending, isRefetching, isError }}>
      {children}
    </PlaylistContext.Provider>
  );
};