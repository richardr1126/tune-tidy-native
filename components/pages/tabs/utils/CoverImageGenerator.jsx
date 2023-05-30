import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, HStack, Heading, Image, Box, Button, Spacer, TextArea, Center, Spinner } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { trigger } from 'react-native-haptic-feedback';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, storeData } from '../../../../utils/asyncStorage';
import { Image as Compressor } from 'react-native-compressor';

// OpenAI API
import { REACT_APP_OPENAI_API_KEY, REACT_APP_SPOTIFY_CLIENT_ID } from '@env';
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const spotify = new SpotifyWebApi();

export default function CoverImageGenerator({ route, navigation }) {
  const selectedPlaylist = route.params.selectedPlaylist;
  const user = route.params.user;
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [imageString, setImageString] = useState(null);
  const [loading, setLoading] = useState(false);
  const CLIENT_ID = REACT_APP_SPOTIFY_CLIENT_ID;

  const handleGeneratePress = async () => {
    setLoading(true);
    trigger('impactLight');
    console.log(prompt);
    await openai.createImage({
      user: user.id,
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json"
    }).then(async (response) => {
      const base64Image = response.data.data[0].b64_json;
      const compressedImage = await Compressor.compress(base64Image, {
        compressionMethod: 'manual',
        quality: 0.2,
        input: 'base64',
        output: 'jpg',
        returnableOutputType: 'base64',
      });
      let sizeInBytes = (compressedImage.length * 3) / 4; // because base64 inflates the size by 1/3
      let sizeInKB = sizeInBytes / 1024;
      console.log(sizeInKB); // log the size

      const imageString = `data:image/jpeg;base64,${compressedImage}`;
      setImage(compressedImage);
      setImageString(imageString);
      
      setLoading(false);

    }).catch((err) => {
      console.log(err);
    });
  }

  const refreshAccessToken = async () => {
    const refreshToken = await getData('refreshToken');

    // Prepare the request body
    let body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CLIENT_ID}`;

    try {
      // Fetch the new access token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }

      const data = await response.json();

      const tokenExpiration = JSON.stringify(Date.now() + 2700000);
      await storeData('token2', data.access_token);
      await storeData('tokenExpiration2', tokenExpiration);
      await storeData('refreshToken', data.refresh_token);
      return data.access_token;
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const setAccessToken = async () => {
    const token = await refreshAccessToken();
    console.log('token is: ', token);
    spotify.setAccessToken(token);
    return token;
  }

  const handleSetCoverPress = async () => {
    try {
      setLoading(true);
      await setAccessToken();
      await spotify.uploadCustomPlaylistCoverImage(selectedPlaylist.id, image);
      setLoading(false);
      //console.log(response);
      navigation.goBack();
      route.params.setRefreshing(true);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <TouchableWithoutFeedback
      onPress={() => { Keyboard.dismiss(); }}>
      <Box flex={1} p={6} bgColor='white' borderRadius='lg'>
        <Heading size={'lg'}>Playlist Cover Art Generator</Heading>
        {/* on blue focus on button */}
        <TextArea value={prompt} onChangeText={setPrompt} variant={'filled'} mt={5} size={'lg'} placeholder={'Describe your new playlist cover, with as much detail as possible'} focusOutlineColor={'#1769ef'} _focus={{ bg: 'coolGray.100' }} />
        {/* <Spacer /> */}
        <Button flex={1} mt={3} maxHeight={'40px'} minW={'100%'} borderRadius={'lg'} onPress={handleGeneratePress} p={2} bgColor={'#1769ef'} _pressed={{
          opacity: 0.5,
        }} isDisabled={loading}>
          <HStack space={2} alignItems="center">
            <FontAwesome5 name="magic" size={20} color="white" />
            <Text color={'white'} fontWeight={'semibold'}>Generate Cover</Text>
          </HStack>
        </Button>
        {/* base 64 image */}
        <Center mt={5}>
          {!loading && <Image source={{ uri: imageString }} alt="Generated Image" size={'2xl'} rounded={'sm'} />}
          {loading && <Spinner accessibilityLabel="Loading..." size={'sm'} color={'grey'} />}
        </Center>
        <Spacer />

        {image && (
          <>
            <Button flex={1} mb={5} maxHeight={'40px'} minW={'100%'} borderRadius={'lg'} onPress={handleSetCoverPress} p={2} bgColor={'#1DB954'} _pressed={{
              opacity: 0.5,
            }} isDisabled={loading}>
              <HStack space={2} alignItems="center">
                <FontAwesome5 name="save" size={20} color="white" />
                <Text color={'white'} fontWeight={'semibold'}>Set as Playlist Cover</Text>
              </HStack>
            </Button>
          </>

        )}
      </Box>
    </TouchableWithoutFeedback>
  );
}
