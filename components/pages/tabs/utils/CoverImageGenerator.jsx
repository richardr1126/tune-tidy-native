import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, HStack, Heading, Image, Box, Button, Spacer, TextArea, Center, Spinner } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { trigger } from 'react-native-haptic-feedback';
import SpotifyWebApi from 'spotify-web-api-js';


// OpenAI API
import { REACT_APP_OPENAI_API_KEY } from '@env';
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
  const [loading, setLoading] = useState(false);

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
    }).then((response) => {
      const base64Image = response.data.data[0].b64_json;
      const base64ImageString = `data:image/jpeg;base64,${base64Image}`;
      console.log(base64ImageString);
      setImage(base64ImageString);
      setLoading(false);

    }).catch((err) => {
      console.log(err);
    });
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
          {!loading && <Image source={{ uri: image }} alt="Generated Image" size={'2xl'} rounded={'sm'} />}
          {loading && <Spinner accessibilityLabel="Loading..." size={'sm'} color={'grey'} />}
        </Center>
        <Spacer />

        {image && (
          <>
            <Text color={'gray.500'}>Cannot set as Spotify cover yet. Coming soon.</Text>
            <Button flex={1} mb={5} maxHeight={'40px'} minW={'100%'} borderRadius={'lg'} onPress={handleGeneratePress} p={2} bgColor={'#1DB954'} _pressed={{
              opacity: 0.5,
            }} isDisabled={true}>
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
