import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import FlatListSkeleton from "~/components/FlatListSkeleton";
import { usePlaylist } from '~/hooks/usePlaylist'; // Adjust the import path as needed
import TrackCard from "~/components/cards/TrackCard";
import { useQueryClient } from "@tanstack/react-query";
import PlaylistHeaderCard from "~/components/cards/PlaylistHeaderCard";
import SortCard from "~/components/cards/SortCard";

export default function PlaylistEditor() {
  const queryClient = useQueryClient();

  const { playlist: playlistId } = useLocalSearchParams();
  const {
    playlist,
    isPlaylistPending,
    isPlaylistRefetching,
    isPlaylistError,
    tracksData,
    isTracksPending,
    isTracksPaging,
    isTracksRefetching,
    isTracksError,
    sortedTracksByFeature,
    reorderTracks,
    createDuplicatePlaylist,
    progress,
    Toast
  } = usePlaylist(playlistId);
  const [sortFeature, setSortFeature] = useState({ feature: 'default', order: 'asc' });

  const navigation = useNavigation();

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    queryClient.invalidateQueries({ queryKey: ['playlistTracks', playlistId] });
  };

  useEffect(() => {
    if (!isPlaylistPending && playlist) {
      navigation.setOptions({
        title: playlist.name,
      });
    }
  }, [playlist?.name]);

  if (isPlaylistPending || isTracksPending) return <FlatListSkeleton editor />;

  const tracks = sortedTracksByFeature(sortFeature);

  return (
    <FlatList
      className='flex-1 mt-[100]'
      data={tracks}
      style={{ overflow: 'visible' }}
      renderItem={({ item }) => <TrackCard track={item.track} />}
      keyExtractor={(item) => item.track.id + item.added_at || item.track.name + item.added_at}
      ListHeaderComponent={
        <>
          <PlaylistHeaderCard playlist={playlist} tracks={tracks} progress={progress} reorderTracks={reorderTracks} createDuplicatePlaylist={createDuplicatePlaylist} />
          <SortCard sortFeature={sortFeature} setSortFeature={setSortFeature} />
          <Toast />
        </>
      }
      ListHeaderComponentStyle={{ flex: 1 }}
      ItemSeparatorComponent={<View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
      refreshing={isPlaylistRefetching || isTracksRefetching}
      onRefresh={onRefresh}
    />
  );
}