import { FlatList, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useStats } from "~/contexts/StatsContext";
import { Text } from "~/components/ui/text";
import TrackCard from "~/components/cards/TrackCard";
import TimeCard from "~/components/cards/TimeCard";
import FlatListSkeleton from "~/components/FlatListSkeleton";

export default function TopTracks() {
  const queryClient = useQueryClient();
  const { tracks, fetchMoreTracks, isTracksPending, isTracksRefetching, isTracksPaging } = useStats();

  const onRefresh = () => {
    queryClient.refetchQueries({ queryKey: ['tracks'] });
  }

  if (isTracksPending) return (
    <FlatListSkeleton />
  );

  return (
    <FlatList
      data={tracks}
      renderItem={({ item, index }) => <TrackCard track={item} index={index + 1} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<TimeCard noPopup />}
      ListHeaderComponentStyle={{ flex: 1 }}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}
      ItemSeparatorComponent={<View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
      refreshing={isTracksRefetching}
      onRefresh={onRefresh}
      onEndReached={fetchMoreTracks}
      onEndReachedThreshold={0.5}
    />
  );
}
