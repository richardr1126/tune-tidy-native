import { useState, useEffect } from 'react';
import { Modal, Progress, Text, VStack, Heading } from "native-base";

export default function LoadingModal({ deviceTheme, isOpen, progress }) {
  const [startTime, setStartTime] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState({ minutes: 0, seconds: 0 });
  const bgColor = deviceTheme === 'dark' ? 'black' : '#f2f2f2';
  const textColor = deviceTheme === 'dark' ? 'gray.100' : 'black';
  const borderColor = deviceTheme === 'dark' ? '#1e1e1e' : '#e5e5e5';
  const itemColor = deviceTheme === 'dark' ? '#141414' : 'white';

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      if (!startTime) {
        setStartTime(new Date());
      } else {
        const currentTime = new Date();
        const timeElapsed = (currentTime - startTime) / 1000;
        const avgTimePerPercent = timeElapsed / progress;
        const remainingPercent = 100 - progress;
        const remainingSeconds = remainingPercent * avgTimePerPercent;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = Math.round(remainingSeconds % 60);

        setEstimatedTime({ minutes, seconds });
      }
    } else {
      setStartTime(null);
      setEstimatedTime({ minutes: 0, seconds: 0 });
    }
  }, [progress, startTime]);

  return (
    <Modal isOpen={isOpen} size={'xl'} closeOnOverlayClick={false} closeOnEsc={false}>
      <Modal.Content mb={'auto'} mt={20} bgColor={itemColor}>
        <Modal.Header bgColor={itemColor}>
          <Heading size={'md'} color={textColor}>
            Sorting your playlist...
          </Heading>
        </Modal.Header>
        <Modal.Body _scrollview={{scrollEnabled: false}}>
          <VStack space={2}>
            <Text fontWeight={'medium'} color={textColor}>
              This may take a while depending on the size of your playlist.
            </Text>
          </VStack>
          <VStack space={2} mt={5}>
            <Text fontWeight={'medium'} fontStyle={'italic'} color={textColor}>
              Estimated wait time: {estimatedTime.minutes > 0 ? `${estimatedTime.minutes} minute(s)` : ""} {`${estimatedTime.seconds} second(s)`}.
            </Text>
            <Progress size={'lg'} bgColor={bgColor} value={progress} minW={'100%'} _filledTrack={{bg: '#1DB954', shadow: 'none'}} />
            <Text mt={5} fontWeight={'medium'} fontStyle={'italic'} color={'red.700'}>
              Warning: Don't close the app, or else the sorting may not be accurate.
            </Text>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
