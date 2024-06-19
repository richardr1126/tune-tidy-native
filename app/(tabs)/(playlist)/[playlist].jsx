import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import FlatListSkeleton from "~/components/FlatListSkeleton";
import { usePlaylist } from '~/contexts/usePlaylist'; // Adjust the import path as needed
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
  } = usePlaylist(playlistId);
  const [sortFeature, setSortFeature] = useState('default');

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

  return (
    <FlatList
      className='flex-1 mt-[100]'
      data={sortedTracksByFeature(sortFeature)}
      style={{ overflow: 'visible' }}
      renderItem={({ item }) => <TrackCard track={item.track} />}
      keyExtractor={(item) => item.track.id || item.track.name + item.track.date_added}
      ListHeaderComponent={
        <>
          <PlaylistHeaderCard playlist={playlist} sortFeature={sortFeature} setSortFeature={setSortFeature} />
          <SortCard sortFeature={sortFeature} setSortFeature={setSortFeature} />
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