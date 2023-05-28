import { Box } from "native-base";
import { Animated } from 'react-native';
import PlaylistTrackCard from '../../../cards/PlaylistTrackCard';

function TracksList({ refreshing, setRefreshing, tracks, spotifyLogo, scrollY }) {
  
  return (
    <Animated.FlatList
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      ListFooterComponent={<Box height={'300px'} />}
      initialNumToRender={10}
      showsVerticalScrollIndicator={false}
      style={{maxHeight: '100%'}}
      data={tracks}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
      renderItem={({ item, index }) => (
        <PlaylistTrackCard item={item} index={index} spotifyLogo={spotifyLogo} />
      )}
      keyExtractor={(item, index) => (index + item.id + item.date_added + item.name)}
    />
  );
}

export default TracksList;
