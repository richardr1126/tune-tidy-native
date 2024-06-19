import { useQuery } from '@tanstack/react-query';
import { useUser } from '~/contexts/UserContext';

const fetchPlaylistDetails = async (spotify, playlistId) => {
  const playlist = await spotify.getPlaylist(playlistId);
  return playlist;
};

const fetchAllPlaylistTracks = async (spotify, playlistId) => {
  let allTracks = [];
  let offset = 0;
  let hasMoreTracks = true;

  while (hasMoreTracks) {
    const response = await spotify.getPlaylistTracks(playlistId, { limit: 50, offset });
    allTracks = [...allTracks, ...response.items];
    offset += 50;
    hasMoreTracks = response.items.length === 50;
  }

  return allTracks;
};

const fetchAudioFeaturesForTracks = async (spotify, trackIds) => {
  const trackFeatures = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    const chunk = await spotify.getAudioFeaturesForTracks(trackIds.slice(i, i + 100));
    trackFeatures.push(...chunk.audio_features);
  }
  return trackFeatures;
};

const sortTracksByFeature = (tracks, sortFeature) => {
  const { feature, order } = sortFeature;
  if (feature === 'default') return tracks;

  const featureMap = {
    trackName: (a, b) => a.track.name.localeCompare(b.track.name),
    dateAdded: (a, b) => new Date(b.added_at) - new Date(a.added_at),
    releaseDate: (a, b) => new Date(b.track.album.release_date) - new Date(a.track.album.release_date),
    albumName: (a, b) => a.track.album.name.localeCompare(b.track.album.name),
    artistName: (a, b) => a.track.artists[0].name.localeCompare(b.track.artists[0].name),
  };

  const audioFeaturesMap = {
    acousticness: (a, b) => b.audioFeatures.acousticness - a.audioFeatures.acousticness,
    danceability: (a, b) => b.audioFeatures.danceability - a.audioFeatures.danceability,
    energy: (a, b) => b.audioFeatures.energy - a.audioFeatures.energy,
    instrumentalness: (a, b) => b.audioFeatures.instrumentalness - a.audioFeatures.instrumentalness,
    liveness: (a, b) => b.audioFeatures.liveness - a.audioFeatures.liveness,
    loudness: (a, b) => b.audioFeatures.loudness - a.audioFeatures.loudness,
    speechiness: (a, b) => b.audioFeatures.speechiness - a.audioFeatures.speechiness,
    valence: (a, b) => b.audioFeatures.valence - a.audioFeatures.valence,
  };

  const sorter = featureMap[feature] || audioFeaturesMap[feature];

  if (featureMap[feature]) {
    return order === 'asc' ? [...tracks].sort(sorter) : [...tracks].sort((a, b) => sorter(b, a));
  } else if (audioFeaturesMap[feature]) {
    const tracksWithFeature = tracks.filter(track => track.audioFeatures && track.audioFeatures[feature] !== undefined);
    const tracksWithoutFeature = tracks.filter(track => !track.audioFeatures || track.audioFeatures[feature] === undefined);

    const sortedTracksWithFeature = order === 'asc' ? tracksWithFeature.slice().sort(sorter) : tracksWithFeature.slice().sort((a, b) => sorter(b, a));

    return [...sortedTracksWithFeature, ...tracksWithoutFeature];
  }

  return tracks;
};

export const usePlaylist = (playlistId) => {
  const { spotify, accessToken, isTokenRefreshing } = useUser();

  const {
    data: playlist,
    isPending: isPlaylistPending,
    isRefetching: isPlaylistRefetching,
    isError: isPlaylistError,
  } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => fetchPlaylistDetails(spotify, playlistId),
    enabled: !!playlistId && !!accessToken && !isTokenRefreshing,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchInterval: Infinity,
  });

  const {
    data: originalTracksData,
    isPending: isTracksPending,
    isRefetching: isTracksRefetching,
    isError: isTracksError,
  } = useQuery({
    queryKey: ['playlistTracks', playlistId],
    queryFn: async () => {
      const allTracks = await fetchAllPlaylistTracks(spotify, playlistId);
      const trackIds = allTracks.map(item => item.track.id);
      const audioFeatures = await fetchAudioFeaturesForTracks(spotify, trackIds);

      const itemsWithFeatures = allTracks.map((item, index) => ({
        ...item,
        audioFeatures: audioFeatures[index],
      }));

      return itemsWithFeatures;
    },
    enabled: !!playlistId && !!accessToken && !isTokenRefreshing,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchInterval: Infinity,
  });

  const sortedTracksByFeature = (sortFeature) => sortTracksByFeature(originalTracksData || [], sortFeature);

  return {
    playlist,
    isPlaylistPending,
    isPlaylistRefetching,
    isPlaylistError,
    tracksData: originalTracksData,
    isTracksPending,
    isTracksRefetching,
    isTracksError,
    sortedTracksByFeature,
  };
};