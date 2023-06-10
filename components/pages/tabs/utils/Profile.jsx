import { Avatar, HStack, Image, Text, Button, VStack, Box, Spacer } from 'native-base';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { clear } from '../../../../utils/asyncStorage';

import spotifyLogo from '../../../../assets/Spotify_Icon_CMYK_Black.png';

import Header from './Header';

export default function Profile({ deviceTheme, user, navigation }) {
  const bgColor = deviceTheme === 'dark' ? 'black' : '#f2f2f2';
  const textColor = deviceTheme === 'dark' ? 'gray.400' : 'black';
  const borderColor = deviceTheme === 'dark' ? '#1e1e1e' : '#e5e5e5';
  const itemColor = deviceTheme === 'dark' ? '#1e1e1e' : 'white';

  const handleBackButtonPress = () => {
    navigation.goBack();
  }

  const handleSpotifyButtonPress = () => {
    Linking.openURL(user?.external_urls?.spotify);
  }

  const handleLogoutButtonPress = async () => {
    await clear();
    navigation.goBack();
    navigation.navigate('Landing');
  }

  const openPrivacyInBrowser = async () => {
    await WebBrowser.openBrowserAsync('https://tunetidy.com/privacy');
  }

  return (
    <Box flex={1} alignItems={'center'} bgColor={bgColor}>
      <Header deviceTheme={deviceTheme} text={user.display_name} handleBackButtonPress={handleBackButtonPress} />
      <VStack mt={'120px'} alignItems={'center'} space={2}>
        <Avatar size={'2xl'} source={{ uri: user?.images[0]?.url }} />
        <Text mb={5} fontWeight={'semibold'} color={textColor}>{user.followers.total} Followers</Text>
      </VStack>
      <Spacer />
      
      <Button mb={2} borderRadius={'lg'} width={'90%'} onPress={handleSpotifyButtonPress} p={3} bgColor={'#1DB954'} _pressed={{
        opacity: 0.5,
      }}>
        <HStack space={2} alignItems="center">
          <Text color={'black'} fontWeight={'semibold'}>View Profile on Spotify</Text>
          <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'28px'} />
        </HStack>
      </Button>
      {/* Privacy Policy button */}
      <Button mb={2} borderRadius={'lg'} width={'90%'} onPress={openPrivacyInBrowser} p={3} bgColor={itemColor} _pressed={{
        opacity: 0.5,
      }}>
        <HStack space={3} alignItems="center">
          <Text color={textColor} fontWeight={'semibold'}>View Privacy Policy</Text>
          <Icon name="shield-alt" size={25} color={deviceTheme === 'dark' ? 'gray' : 'black'} />
        </HStack>
      </Button>
      {/* Logout button */}
      <Button mb={5} borderRadius={'lg'} width={'90%'} onPress={handleLogoutButtonPress} p={3} bgColor={'red.600'} _pressed={{
        opacity: 0.5,
      }}>
        <HStack space={3} alignItems="center">
          <Text color={'white'} fontWeight={'semibold'}>Logout</Text>
          <Icon name="sign-out-alt" size={25} color={'white'} />
        </HStack>
      </Button>
      
    </Box>
  )
}