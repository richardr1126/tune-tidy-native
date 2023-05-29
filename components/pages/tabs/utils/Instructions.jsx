import { Text, VStack, HStack, Heading, Container, Box, Button, Spacer } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Instructions({ navigation }) {
  const handleGetStartedPressed = () => {
    navigation.goBack();
  }

  return (
    <Box flex={1} p={8} bgColor='white' borderRadius='lg'>
      <Container flex={1}>
        <HStack justifyContent='space-between' alignItems='center'>
          <Heading size='lg'>Welcome to the Playlist Sorter!</Heading>
        </HStack>

        <VStack mt={5}>
          <Text fontSize={'md'}>
            Here you can sort your playlist by many fun criteria, such as danceability, release date, or energy. Then you can save them as new playlists or overwrite the original.
          </Text>

          <HStack space={3} alignItems='center'>
            <FontAwesome5 name='copy' size={24} color={'black'} />
            <Text fontSize={'md'}>
              Creat Copy: creates a copy of the sorted playlist and adds it to your Spotify account. Refresh the page after copying to view the new playlist.
            </Text>
          </HStack>

          <HStack space={3} alignItems='center'>
            <FontAwesome5 name='edit' size={24} color={'red'} />
            <Text fontSize={'md'}>
              Override Playlist: overwrites the original playlist with the sorted version. You will lose any manually set custom order you have set for the playlist, however you can always revert back to the Date Added as your sort order.
            </Text>
          </HStack>
        </VStack>
      </Container>
      <Spacer />
      <Button flex={1} maxHeight={'50px'} minW={'100%'} borderRadius={'lg'} width={'90%'} onPress={handleGetStartedPressed} p={3} bgColor={'#1DB954'} _pressed={{
        opacity: 0.5,
      }}>
        <Text color={'black'} fontWeight={'semibold'}>Get Started</Text>
      </Button>
    </Box>
  );
}
