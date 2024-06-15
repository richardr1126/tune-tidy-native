import React, { createContext, useContext, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData } from '~/utils/asyncStorage';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

const spotify = new SpotifyWebApi();
const StatsContext = createContext();

export const useStats = () => useContext(StatsContext);

export const StatsProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState('medium_term');

  const checkToken = async () => {
    const storedToken = await getData('token2');
    if (!storedToken) {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      return null;
    }

    try {
      spotify.setAccessToken(storedToken);
    } catch (error) {
      console.log('Error setting access token:', error);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      return null;
    }
  };

  const fetchArtists = async ({ pageParam = 0 }) => {
    await checkToken();
    const response = await spotify.getMyTopArtists({ time_range: timeRange, limit: 50, offset: pageParam });
    return {
      items: response.items,
      nextPage: response.items.length ? pageParam + 50 : null,
    };
  };

  const fetchTracks = async ({ pageParam = 0 }) => {
    await checkToken();
    const response = await spotify.getMyTopTracks({ time_range: timeRange, limit: 50, offset: pageParam });
    return {
      items: response.items,
      nextPage: response.items.length ? pageParam + 50 : null,
    };
  };

  const fetchTopAlbums = async () => {
    let allTracks = [];
    let pageParam = 0;
    let hasMore = true;

    await checkToken();

    while (hasMore) {
      const response = await spotify.getMyTopTracks({ time_range: timeRange, limit: 50, offset: pageParam });
      allTracks = allTracks.concat(response.items);
      pageParam += 50;
      hasMore = response.items.length === 50;
    }

    const albumMap = new Map();

    allTracks.forEach((track) => {
      const album = track.album;
      if (albumMap.has(album.id)) {
        albumMap.get(album.id).count += 1;
      } else {
        albumMap.set(album.id, { ...album, count: 1 });
      }
    });

    return Array.from(albumMap.values()).sort((a, b) => b.count - a.count);
  };

  const {
    data: artistsData,
    fetchNextPage: fetchMoreArtists,
    isRefetching: isArtistsRefetching,
    isPending: isArtistsPending,
    isFetchingNextPage: isArtistsPaging,
    isError: isArtistError,
  } = useInfiniteQuery({
    queryKey: ['artists', timeRange],
    queryFn: fetchArtists,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour
  });

  const {
    data: tracksData,
    fetchNextPage: fetchMoreTracks,
    isRefetching: isTracksRefetching,
    isPending: isTracksPending,
    isFetchingNextPage: isTracksPaging,
    isError: isTracksError,
  } = useInfiniteQuery({
    queryKey: ['tracks', timeRange],
    queryFn: fetchTracks,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour,
  });

  const {
    data: albums,
    isRefetching: isAlbumsRefetching,
    isPending: isAlbumsPending,
    isError: isAlbumsError,
  } = useQuery({
    queryKey: ['albums', timeRange],
    queryFn: fetchTopAlbums,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000, // 1 hour
    refetchInterval: 3600000, // 1 hour
  });

  const artists = artistsData?.pages.flatMap((page) => page.items) || [];
  const tracks = tracksData?.pages.flatMap((page) => page.items) || [];

  return (
    <StatsContext.Provider value={{
      timeRange,
      setTimeRange,
      artists,
      isArtistsPending,
      isArtistsRefetching,
      isArtistsPaging,
      fetchMoreArtists,
      tracks,
      isTracksPending,
      isTracksRefetching,
      isTracksPaging,
      fetchMoreTracks,
      albums, // Providing albums in the context
      isAlbumsPending,
      isAlbumsRefetching,
      isAlbumsError
    }}>
      {children}
    </StatsContext.Provider>
  );
};