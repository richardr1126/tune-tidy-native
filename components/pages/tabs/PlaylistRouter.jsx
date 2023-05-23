import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlaylistSelector from "./utils/PlaylistSelector";
import PlaylistEditor from "./utils/PlaylistEditor";

const Stack = createStackNavigator();

function PlaylistRouter({user, playlistData}) {
  return (
    <Stack.Navigator initialRouteName="Playlist Selector" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Playlist Selector">
        {(props) => <PlaylistSelector {...props} playlistData={playlistData} />}
      </Stack.Screen>
      <Stack.Screen name="Playlist Editor" component={PlaylistEditor} />
    </Stack.Navigator>
  );
}

export default React.memo(PlaylistRouter);