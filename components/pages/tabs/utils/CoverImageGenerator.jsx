import { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, HStack, Heading, Image, Box, Button, Spacer, TextArea, Center, Spinner, useColorModeValue } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { trigger } from 'react-native-haptic-feedback';
import SpotifyWebApi from 'spotify-web-api-js';
import { getData, storeData } from '../../../../utils/asyncStorage';
import { Image as Compressor } from 'react-native-compressor';


// OpenAI API
import { REACT_APP_OPENAI_API_KEY, REACT_APP_SPOTIFY_CLIENT_ID } from '@env';
const spotify = new SpotifyWebApi();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: REACT_APP_OPENAI_API_KEY,
});

export default function CoverImageGenerator({ route, navigation }) {
  const bgColor = useColorModeValue('white', '#141414');
  const textColor = useColorModeValue('black', 'gray.100');
  const borderColor = useColorModeValue('#e5e5e5', '#1e1e1e');
  const selectedPlaylist = route.params.selectedPlaylist;
  const [userId, setUserId] = useState(null);
  const user = route.params.user;
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [generationLimit, setGenerationLimit] = useState(5);
  const [imageString, setImageString] = useState(null);
  const [loading, setLoading] = useState(false);
  const CLIENT_ID = REACT_APP_SPOTIFY_CLIENT_ID;

  const generateUserId = async () => {
    //generate random user id and store and retreive it from async storage, only generate once
    const fromStore_userId = await getData('userId');
    if (fromStore_userId === null) {
      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await storeData('userId', randomId);
      setUserId(randomId);
    } else {
      setUserId(fromStore_userId);
    }
  }

  useEffect(() => {
    generateUserId();
  }, []);


  const handleGeneratePress = async () => {
    setLoading(true);
    trigger('impactLight');
    console.log(prompt);

    await openai.images.generate({
      user: userId,
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    }).then(async (response) => {
      console.log(response);
      const base64Image = response.data[0].b64_json;
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
      await addToGenerationLimit();

    }).catch((err) => {
      console.log(err);
      setLoading(false);
    });
  }

  const addToGenerationLimit = async () => {
    const currentDateString = new Date().toDateString();
    const lastUpdateDateString = await getData('lastUpdateDate');
    
    let generationLimit = await getGenerationLimit();
  
    if (currentDateString !== lastUpdateDateString) {
      generationLimit = 0;
      await storeData('lastUpdateDate', currentDateString);
    }
    if (user.display_name === 'Richard Roberson') {
      generationLimit = 0;
    }

    const newGenerationLimitString = JSON.stringify(generationLimit + 1);
    await storeData('generationLimit', newGenerationLimitString);
    setGenerationLimit(generationLimit + 1);
  }
  
  const getGenerationLimit = async () => {
    const currentDateString = new Date().toDateString();
    const lastUpdateDateString = await getData('lastUpdateDate');
  
    if (currentDateString !== lastUpdateDateString) {
      await storeData('lastUpdateDate', currentDateString);
      await storeData('generationLimit', '0');
      return 0;
    }
  
    const generationLimitString = await getData('generationLimit');
    const generationLimit = parseInt(generationLimitString);
    console.log('generationLimit is: ', generationLimit);
    if (generationLimit === null || isNaN(generationLimit)) {
      return 0;
    } else {
      return generationLimit;
    }
  }
  
  useEffect(() => {
    getGenerationLimit().then((generationLimit) => {
      setGenerationLimit(generationLimit);
    });
  }, []);
  

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
    //console.log('token is: ', token);
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
      <Box flex={1} p={6} bgColor={bgColor} borderRadius='lg'>
        <HStack alignItems={'center'} space={1}>
          <FontAwesome5 name="magic" size={20} color="#1769ef"/>
          <Heading size={'lg'} color={textColor}>
            Cover Art Generator
          </Heading>
        </HStack>
        

        {/* on blue focus on button */}
        <Text mt={5} fontSize={'md'} fontWeight={'medium'} color={textColor}>{3-generationLimit} generations left today</Text>
        <TextArea value={prompt} onChangeText={setPrompt} variant={'filled'} mt={3} size={'lg'} placeholder={'Describe your new playlist cover, with as much detail as possible. Powered by OpenAI.'} focusOutlineColor={'#1769ef'} _focus={{ bg: borderColor }} />
        {/* <Spacer /> */}
        <Button flex={1} mt={3} maxHeight={'40px'} minW={'100%'} borderRadius={'lg'} onPress={handleGeneratePress} p={2} bgColor={'#1769ef'} _pressed={{
          opacity: 0.5,
        }} isDisabled={loading||generationLimit>=3||!prompt}>
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
            }} isDisabled={loading||generationLimit>=4}>
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
