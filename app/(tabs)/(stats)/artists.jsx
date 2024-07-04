import { FlatList, View } from "react-native";
import { usePlaylists } from "~/contexts/PlaylistsContext";
import { useQueryClient } from "@tanstack/react-query";
import { useStats } from "~/contexts/StatsContext";
import { Text } from "~/components/ui/text";
import ArtistCard from "~/components/cards/ArtistCard";
import { Separator } from '~/components/ui/separator';
import FlatListSkeleton from "~/components/FlatListSkeleton";
import TimeCard from "~/components/cards/TimeCard";

function TopArtists() {
  const queryClient = useQueryClient();
  const { artists, fetchMoreArtists, isArtistsRefetching, isArtistsPending, isArtistsPaging } = useStats();

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['artists'] });
  }

  if (isArtistsPending) return (
    <FlatListSkeleton />
  );

  return (
    <FlatList
      data={artists}
      renderItem={({ item, index }) => <ArtistCard artist={item} index={index+1} />}
      keyExtractor={(item) => item.id}
      
      ListHeaderComponent={<TimeCard artistPopup />}
      ListHeaderComponentStyle={{flex: 1}}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}

      ItemSeparatorComponent={<View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
      refreshing={isArtistsRefetching}
      onRefresh={onRefresh}
      onEndReached={fetchMoreArtists}
      onEndReachedThreshold={0.5}
    />
  );
}

export default TopArtists;