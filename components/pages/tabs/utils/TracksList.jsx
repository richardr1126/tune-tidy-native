import { Box } from "native-base";
import { Animated } from 'react-native';
import PlaylistTrackCard from '../../../cards/PlaylistTrackCard';

function TracksList({ tracks, spotifyLogo, scrollY }) {
  return (
    <Animated.FlatList
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true } // Add this to improve performance
      )}
      ListFooterComponent={<Box height={'100px'} />}
      initialNumToRender={20}
      showsVerticalScrollIndicator={false}
      style={{maxHeight: '85%'}}
      data={tracks}
      renderItem={({ item, index }) => (
        <PlaylistTrackCard item={item} index={index} spotifyLogo={spotifyLogo} />
      )}
      keyExtractor={(item, index) => (index + item.id + item.date_added + item.name)}
    />
  );
}

export default TracksList;
