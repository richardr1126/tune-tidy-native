import { Text, HStack, Heading, Box, Button, Spacer, ScrollView, useColorModeValue } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { storeData } from '../../../../utils/asyncStorage';

export default function Instructions({ navigation }) {
  const bgColor = useColorModeValue('white', 'black');
  const textColor = useColorModeValue('black', 'gray.400');
  const borderColor = useColorModeValue('#e5e5e5', '#1e1e1e');
  const itemColor = useColorModeValue('white', '#1e1e1e');
  const deviceTheme = useColorModeValue('light', 'dark');

  const handleGetStartedPressed = async () => {
    await storeData('viewedInstructions', 'true');
    navigation.goBack();
  }

  return (
    <Box flex={1} p={8} borderRadius='lg' bgColor={itemColor}>

      <Heading size='lg' color={textColor}>Welcome to the Playlist Sorter!</Heading>
      <Text fontSize={'md'} mt={3} color={textColor}>
        Here you can sort your playlist by many fun criteria, such as danceability, release date, or energy. Then you can save them as new playlists or overwrite the original.
      </Text>

      <ScrollView mt={5} flex={1} minH={'45%'}>
        <HStack space={3} width={'90%'} mb={2}>
          <FontAwesome5 name='copy' style={{paddingTop: 4}} size={24} color={deviceTheme === 'dark' ? 'gray' : 'black'} />
          <Text fontSize={'sm'} color={textColor}>
            Creat Copy: creates a copy of the sorted playlist and adds it to your Spotify account. Refresh the page after copying to view the new playlist.
          </Text>
        </HStack>
        <HStack space={3}width={'90%'} mb={2}>
          <FontAwesome5 name='edit' style={{paddingTop: 4}} size={24} color={'red'} />
          <Text fontSize={'sm'} color={textColor}>
            Override Playlist: overwrites the original playlist with the sorted version. You will lose any manually set custom order you have set for the playlist, however you can always revert back to the Date Added as your sort order.
          </Text>
        </HStack>
        <HStack space={3} width={'90%'} mb={2}>
          <FontAwesome5 name='magic' style={{paddingTop: 4}} size={24} color={'#1769ef'} />
          <Text fontSize={'sm'} color={textColor}>
            Generate Cover: generates a new playlist cover for your playlist. You can describe your new cover with as much detail as possible, and the AI will try to generate a cover that matches your description.
          </Text>
        </HStack>
      </ScrollView>

      <Spacer />
      <Button flex={1} maxHeight={'50px'} minW={'100%'} borderRadius={'lg'} width={'90%'} onPress={handleGetStartedPressed} p={3} bgColor={'#1DB954'} _pressed={{
        opacity: 0.5,
      }}>
        <Text color={'black'} fontWeight={'semibold'}>Get Started</Text>
      </Button>
    </Box>
  );
}
