import { Avatar, HStack, Image, Text, Button, VStack } from 'native-base';
import { Linking } from 'expo-linking';
import Icon from 'react-native-vector-icons/FontAwesome5';

import spotifyLogo from '../../../../assets/Spotify_Icon_CMYK_Black.png';

import Header from './Header';

export default function Profile({ user, navigation }) {
  const handleBackButtonPress = () => {
    navigation.goBack();
  }

  const handleSpotifyButtonPress = () => {
    Linking.openURL(user.external_urls.spotify);
  }

  const handleLogoutButtonPress = () => {
    navigation.navigate('Landing');
  }

  return (
    <>
      <Header text={user.display_name} handleBackButtonPress={handleBackButtonPress} />
      <VStack mt={'120px'} alignItems={'center'} space={2}>
        <Avatar size={'2xl'} source={{ uri: user.images[0].url }} />
        <Text mb={5} fontWeight={'semibold'}>{user.followers.total} Followers</Text>
        <Button borderRadius={'lg'} width={'90%'} onPress={handleSpotifyButtonPress} p={3} bgColor={'#1DB954'} _pressed={{
          opacity: 0.5,
        }}>
          <HStack space={1} alignItems="center">
            <Image source={spotifyLogo} alt="Spotify Logo" boxSize={'25px'} />
            <Text color={'black'} fontWeight={'semibold'}>View on Spotify</Text>
          </HStack>
        </Button>
        {/* Logout button */}
        <Button borderRadius={'lg'} width={'90%'} onPress={handleLogoutButtonPress} p={3} bgColor={'red.600'} _pressed={{
          opacity: 0.5,
        }}>
          <HStack space={1} alignItems="center">
            <Icon name="sign-out-alt" size={25} color={'white'} />
            <Text color={'white'} fontWeight={'semibold'}>Logout</Text>
          </HStack>
        </Button>
      </VStack>
    </>
  )
}