import React from 'react';
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
      ListFooterComponent={<Box height={10} />}
      initialNumToRender={20}
      showsVerticalScrollIndicator={false}
      mb={5}
      maxH={'2/3'}
      mt={5}
      data={tracks}
      renderItem={({ item, index }) => (
        <PlaylistTrackCard item={item} index={index} spotifyLogo={spotifyLogo} />
      )}
      keyExtractor={(item, index) => (index + item.id + item.date_added + item.name)}
    />
  );
}

export default React.memo(TracksList);