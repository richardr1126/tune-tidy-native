import { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlaylistSelector from "./utils/PlaylistSelector";
import PlaylistEditor from "./utils/PlaylistEditor";
import Profile from './utils/Profile';
import Instructions from './utils/Instructions';

const Stack = createStackNavigator();

function PlaylistRouter({rootNavigator, user, playlistData, refreshing, setRefreshing}) {
  return (
    <Stack.Navigator initialRouteName="Playlist Selector" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Playlist Selector">
        {(props) => <PlaylistSelector {...props} rootNavigator={rootNavigator} user={user} playlistData={playlistData} refreshing={refreshing} setRefreshing={setRefreshing} />}
      </Stack.Screen>
      <Stack.Screen name="Playlist Editor">
        {(props) => <PlaylistEditor {...props} rootNavigator={rootNavigator} />}
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {props => <Profile {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default memo(PlaylistRouter);