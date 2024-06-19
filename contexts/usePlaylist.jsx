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

  const reorderTracks = async (playlist, tracks) => {
    if (!spotify || !accessToken || isTokenRefreshing) return;
  
    const playlistId = playlist.id;
    const newOrder = tracks.slice();
    const batchSize = 10;
  
    const playlistDetails = await spotify.getPlaylist(playlistId);
    let snapshotId = playlistDetails.snapshot_id;
  
    // Create a map of current track positions
    const currentPositions = originalTracksData.reduce((acc, track, index) => {
      acc[track.track.id] = index;
      return acc;
    }, {});
  
    // Generate reordering operations based on newOrder
    const reorderingOperations = newOrder.map((track, newPosition) => {
      const currentPosition = currentPositions[track.track.id];
      return { currentPosition, newPosition };
    });
  
    reorderingOperations.sort((a, b) => a.newPosition - b.newPosition);
  
    for (let i = 0; i < reorderingOperations.length; i++) {
      const operation = reorderingOperations[i];
      const { currentPosition, newPosition } = operation;
  
      if (currentPosition !== newPosition) {
        try {
          console.log(`Reordering track from position ${currentPosition} to ${newPosition}`);
  
          await new Promise((resolve) => setTimeout(resolve, 75));
          const data = await spotify.reorderTracksInPlaylist(playlistId, currentPosition, newPosition, {
            snapshot_id: snapshotId,
          });
          snapshotId = data.snapshot_id;
  
          for (const op of reorderingOperations) {
            if (op.currentPosition > currentPosition && op.currentPosition <= newPosition) {
              op.currentPosition -= 1;
            } else if (op.currentPosition < currentPosition && op.currentPosition >= newPosition) {
              op.currentPosition += 1;
            }
          }
  
          // Update the progress bar after every batchSize operations
          if (i % batchSize === batchSize - 1 || i === reorderingOperations.length - 1) {
            console.log(`Progress: ${((i + 1) / tracks.length) * 100}%`);
          }
        } catch (error) {
          console.error(`Error reordering track from position ${currentPosition} to ${newPosition}:`, error);
          return;
        }
      }
    }
  
    console.log('Sorted playlist successfully overridden');
  };

  const createDuplicatePlaylist = async (user, playlist, tracks) => {
    if (!spotify || !accessToken || isTokenRefreshing) return;

    try {
      const newPlaylist = await spotify.createPlaylist(user.id, {
        name: `${playlist.name} - Sorted`,
        description: `${playlist.description ? `${playlist.description}. ` : ''}Sorted playlist`,
      });
      const newPlaylistId = newPlaylist.id;
      const trackUris = tracks.filter((track) => track.id).map((track) => track.uri);

      for (let i = 0; i < trackUris.length; i += 100) {
        const chunk = trackUris.slice(i, i + 100);
        await spotify.addTracksToPlaylist(newPlaylistId, chunk);
      }

      console.log('Sorted playlist successfully copied');
    } catch (error) {
      console.error('Error creating new playlist:', error);
    }
  };

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
    reorderTracks,
    createDuplicatePlaylist,
  };
};