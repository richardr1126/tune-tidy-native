import { FlatList, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useStats } from "~/contexts/StatsContext";
import { Text } from "~/components/ui/text";
import AlbumCard from "~/components/cards/AlbumCard";
import TimeCard from "~/components/cards/TimeCard";
import FlatListSkeleton from "~/components/FlatListSkeleton";

export default function TopAlbums() {
  const queryClient = useQueryClient();
  const { albums, isAlbumsPending, isAlbumsRefetching } = useStats();

  const onRefresh = () => {
    queryClient.refetchQueries({ queryKey: ['albums'] });
  }

  if (isAlbumsPending) return (
    <FlatListSkeleton album />
  );

  return (
    <FlatList
      data={albums}
      renderItem={({ item, index }) => <AlbumCard album={item} index={index + 1} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<TimeCard noPopup />}
      ListHeaderComponentStyle={{ flex: 1 }}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}
      ItemSeparatorComponent={<View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
      refreshing={isAlbumsRefetching}
      onRefresh={onRefresh}
    />
  );
}
