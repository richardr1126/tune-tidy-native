import React, { createContext, useContext, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '~/contexts/UserContext';

const StatsContext = createContext();

export const useStats = () => useContext(StatsContext);

export const StatsProvider = ({ children }) => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const { spotify, accessToken, isTokenRefreshing } = useUser();

  const fetchArtists = async ({ pageParam = 0 }) => {
    const response = await spotify.getMyTopArtists({ time_range: timeRange, limit: 25, offset: pageParam });
    return {
      items: response.items,
      nextPage: response.items.length ? pageParam + 25 : null,
    };
  };

  const fetchTracks = async ({ pageParam = 0 }) => {
    const response = await spotify.getMyTopTracks({ time_range: timeRange, limit: 25, offset: pageParam });
    return {
      items: response.items,
      nextPage: response.items.length ? pageParam + 25 : null,
    };
  };

  const fetchTopAlbums = async () => {
    let allTracks = [];
    let pageParam = 0;
    let hasMore = true;
  
    // Fetch all tracks in one loop
    while (hasMore) {
      const response = await spotify.getMyTopTracks({ time_range: timeRange, limit: 50, offset: pageParam });
      allTracks = allTracks.concat(response.items);
      pageParam += 50;
      hasMore = response.items.length === 50;
    }
  
    // Create a map to track album scores and details
    const albumMap = new Map();
  
    // Populate the map with album data and calculate scores
    allTracks.forEach((track, index) => {
      const album = track.album;
      if (!albumMap.has(album.id)) {
        albumMap.set(album.id, {
          ...album,
          tracks: [track],
          score: 0,
        });
      } else {
        albumMap.get(album.id).tracks.push(track);
      }
  
      // Calculate score based on track position and apply a linear penalty based on album length
      const baseScore = (allTracks.length - index) / album.total_tracks;
      const penalty = Math.max(0, (7 - album.total_tracks) * 0.1); // Linear penalty decreases with more tracks
      albumMap.get(album.id).score += baseScore * (1 - penalty);
    });
  
    // Convert the map to an array, filter, and sort
    return Array.from(albumMap.values())
      .filter(album => album.total_tracks >= 4)
      .sort((a, b) => b.score - a.score);
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
    staleTime: Infinity, // 1 hour
    cacheTime: Infinity, // 1 hour
    refetchInterval: Infinity, // 1 hour
    enabled: (!!accessToken) && (!isTokenRefreshing),
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
    staleTime: Infinity, // 1 hour
    cacheTime: Infinity, // 1 hour
    refetchInterval: Infinity, // 1 hour,
    enabled: (!!accessToken) && (!isTokenRefreshing),
  });

  const {
    data: albums,
    isRefetching: isAlbumsRefetching,
    isPending: isAlbumsPending,
    isError: isAlbumsError,
  } = useQuery({
    queryKey: ['albums', timeRange],
    queryFn: fetchTopAlbums,
    staleTime: Infinity, // 1 hour
    cacheTime: Infinity, // 1 hour
    refetchInterval: Infinity, // 1 hour
    enabled: (!!accessToken) && (!isTokenRefreshing),
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