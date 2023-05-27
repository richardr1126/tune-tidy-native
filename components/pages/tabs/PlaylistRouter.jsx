import { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlaylistSelector from "./utils/PlaylistSelector";
import PlaylistEditor from "./utils/PlaylistEditor";

const Stack = createStackNavigator();

function PlaylistRouter({user, playlistData, refreshing, setRefreshing}) {
  return (
    <Stack.Navigator initialRouteName="Playlist Selector" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Playlist Selector">
        {(props) => <PlaylistSelector {...props} playlistData={playlistData} refreshing={refreshing} setRefreshing={setRefreshing} />}
      </Stack.Screen>
      <Stack.Screen name="Playlist Editor" component={PlaylistEditor} />
    </Stack.Navigator>
  );
}

export default memo(PlaylistRouter);