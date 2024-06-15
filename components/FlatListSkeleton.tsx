import { FlatList, View } from "react-native";
import { Skeleton } from '~/components/ui/skeleton';
import SkeletonCard from "~/components/cards/SkeletonCard";
import PlaylistListPopup from "~/components/cards/PlaylistListPopup";
import TimeCard from "~/components/cards/TimeCard";

function FlatListSkeleton({playlist, artist, album}: {playlist: boolean, artist: boolean, album: boolean}) {
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <FlatList
      className={playlist ? 'mt-14': ''}
      data={ids}
      renderItem={() => <SkeletonCard />}
      keyExtractor={(id) => 'skeleton'+id}
      ListHeaderComponent={playlist ? <PlaylistListPopup /> : artist ? <TimeCard artistPopup /> : album ? <TimeCard albumPopup /> : <TimeCard />}
      ListFooterComponentStyle={{ flex: 1 }}
      ItemSeparatorComponent={() => <View className="h-2" />}
      ListFooterComponent={<View className="h-2" />}
    />
  );
}

export default FlatListSkeleton;