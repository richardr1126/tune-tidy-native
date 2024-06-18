import { useEffect, useState, useId } from "react";
import { FlatList, View, Text } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import FlatListSkeleton from "~/components/FlatListSkeleton";
import { usePlaylist } from '~/contexts/usePlaylist'; // Adjust the import path as needed
import TrackCard from "~/components/cards/TrackCard";
import { Image } from "expo-image";
import { blurhash } from '~/lib/utils';
import { useQueryClient } from "@tanstack/react-query";
import PlaylistHeaderCard from "~/components/cards/PlaylistHeaderCard";


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
  const [sortFeature, setSortFeature] = useState('default')

  const navigation = useNavigation();

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    queryClient.invalidateQueries({ queryKey: ['playlistTracks', playlistId] });
  };

  useEffect(() => {
    //console.log('playlist', playlist);
    if (!isPlaylistPending && playlist) {
      //console.log('playlist', playlist);
      navigation.setOptions({
        title: playlist.name,
        //headerRight: () => <Text>Save</Text>,
      });
    }
  }, [playlist?.name]);



  // if (isPlaylistPending || isTracksPending) return <FlatListSkeleton />;
  // if (isPlaylistError || isTracksError) return <View><Text>Error loading playlist or tracks</Text></View>;


  if (isPlaylistPending || isTracksPending) return <FlatListSkeleton editor />;

  return (
    <FlatList
      className='flex-1 mt-[100]'
      data={sortedTracksByFeature(sortFeature)}
      style={{ overflow: 'visible' }}
      renderItem={({ item }) => <TrackCard track={item.track} />}
      keyExtractor={(item) => item.track.id || item.track.name + item.track.date_added}
      ListHeaderComponent={<PlaylistHeaderCard playlist={playlist} sortFeature={sortFeature} setSortFeature={setSortFeature} />}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}
      ListHeaderComponentStyle={{flex: 1}}
      ItemSeparatorComponent={<View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
      refreshing={isPlaylistRefetching || isTracksRefetching}
      onRefresh={onRefresh}
      // onEndReached={() => fetchMoreTracks()}
      // onEndReachedThreshold={0.5}
    />
  );
}