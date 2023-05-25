import { Box, Button, Container, Heading, HStack, ChevronLeftIcon } from 'native-base';

export default function Header({text, handleBackButtonPress}) {
  return (
    <Box style={{
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5',
    }} height={'100px'} width={'100%'} position={'absolute'} top={0} left={0} bgColor={'white'} zIndex={1}>
      <Container mt={'55px'} mb={'25px'} mx={'25px'}>
        <HStack alignItems="center">
          <Button onPress={handleBackButtonPress}
            p={2}
            mr={2}
            startIcon={<ChevronLeftIcon color='#5e5e5e' size="5" />}
            color={'white'}
            bgColor={'white'}
            shadow={1}
            _pressed={{
              bgColor: 'white',
              opacity: 0.2
            }}
          >
          </Button>
          <Heading>{text}</Heading>
        </HStack>
      </Container>
    </Box>
  )
}