import { Box, Button, Container, Heading, HStack, ChevronLeftIcon } from 'native-base';
import { useEffect, useState } from 'react';

export default function Header({text, handleBackButtonPress}) {
  const [textSize, setTextSize] = useState('30px');
  
  useEffect(() => {
    //max characters for playlist name is 100
    if (text.length >= 80) {
      setTextSize('8px');
    } else if (text.length >= 60) {
      setTextSize('10px');
    } else if (text.length >= 50) {
      setTextSize('12px');
    } else if (text.length >= 31) {
      setTextSize('14px');
    } else if (text.length >= 20) {
      setTextSize('25px');
    } else {
      setTextSize('30px');
    }
  }, [])




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
          <Heading fontSize={textSize}>{text}</Heading>
        </HStack>
      </Container>
    </Box>
  )
}