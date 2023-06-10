import { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlaylistSelector from "./utils/PlaylistSelector";
import PlaylistEditor from "./utils/PlaylistEditor";
import Profile from './utils/Profile';
import { useColorModeValue } from "native-base";

const Stack = createStackNavigator();

function PlaylistRouter({ rootNavigator, user, playlistData, refreshing, setRefreshing }) {
  const bgColor = useColorModeValue('#f2f2f2', 'black');
  const deviceTheme = useColorModeValue('light', 'dark');

  return (
    <Stack.Navigator initialRouteName="Playlist Selector" screenOptions={{ headerShown: false, cardStyle: { backgroundColor: bgColor } }}>
      <Stack.Screen name="Playlist Selector" options={{ headerShown: false }}>
        {(props) => <PlaylistSelector {...props} deviceTheme={deviceTheme} rootNavigator={rootNavigator} user={user} playlistData={playlistData} refreshing={refreshing} setRefreshing={setRefreshing} />}
      </Stack.Screen>
      <Stack.Screen name="Playlist Editor">
        {(props) => <PlaylistEditor {...props} deviceTheme={deviceTheme} rootNavigator={rootNavigator} />}
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {props => <Profile {...props} deviceTheme={deviceTheme} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default memo(PlaylistRouter);