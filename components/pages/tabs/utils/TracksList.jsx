import React from 'react';
import { Box, FlatList } from "native-base";
import PlaylistTrackCard from '../../../cards/PlaylistTrackCard';

function TracksList({ tracks, spotifyLogo }) {
  return (
    <FlatList
      ListFooterComponent={<Box height={10} />}
      initialNumToRender={20}
      showsVerticalScrollIndicator={false}
      mb={5}
      maxH={'2/3'}
      mt={5}
      data={tracks}
      renderItem={({ item, index }) => (
        <PlaylistTrackCard item={item} index={index} spotifyLogo={spotifyLogo} />
      )} keyExtractor={(item, index) => (index + item.id + item.date_added + item.name)} />
  );
}

export default React.memo(TracksList);