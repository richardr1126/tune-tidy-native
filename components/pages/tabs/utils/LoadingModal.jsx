import { useState, useEffect } from 'react';
import { Modal, Progress, Text, VStack, Heading } from "native-base";

export default function LoadingModal({ isOpen, progress }) {
  const [startTime, setStartTime] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState({ minutes: 0, seconds: 0 });

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
    <Modal isOpen={isOpen} size={'xl'} closeOnOverlayClick={false}>
      <Modal.Content mb={'auto'} mt={20}>
        <Modal.Header>
          <Heading size={'md'}>
            Sorting your playlist...
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <VStack space={2}>
            <Text fontWeight={'medium'}>
              This may take a while depending on the size of your playlist.
            </Text>
          </VStack>
          <VStack space={2} mt={5}>
            <Text fontWeight={'medium'} fontStyle={'italic'}>
              Estimated wait time: {estimatedTime.minutes > 0 ? `${estimatedTime.minutes} minute(s)` : ""} {`${estimatedTime.seconds} second(s)`}.
            </Text>
            <Progress size={'lg'} value={progress} minW={'100%'} _filledTrack={{bg: '#1DB954', shadow: 'none'}} />
            <Text mt={5} fontWeight={'medium'} fontStyle={'italic'} color={'red.700'}>
              Warning: Don't close the app, or else the sorting may not be accurate.
            </Text>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
