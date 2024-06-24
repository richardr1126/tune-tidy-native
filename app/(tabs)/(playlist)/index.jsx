import { FlatList, View } from "react-native";
import { usePlaylists } from "~/contexts/PlaylistsContext";
import { useQueryClient } from "@tanstack/react-query";
import PlaylistCard from "~/components/cards/PlaylistCard";
import PlaylistListPopup from "~/components/cards/PlaylistListPopup";
import FlatListSkeleton from "~/components/FlatListSkeleton";

function PlaylistSelector() {
  const queryClient = useQueryClient();
  const { playlists, isPending, isRefetching } = usePlaylists();

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
  }

  if (isPending) return (
    <FlatListSkeleton playlist />
  );

  return (
    <FlatList
      className="mt-16"
      data={playlists}
      style={{ overflow: 'visible' }}
      renderItem={({ item }) => <PlaylistCard playlist={item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponentStyle={{flex: 1}}
      ItemSeparatorComponent={<View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      stickyHeaderIndices={[0]} // Replace 0 with the index of the item you want to be sticky
      ListHeaderComponent={<PlaylistListPopup />}
    />
  );
}

export default PlaylistSelector;