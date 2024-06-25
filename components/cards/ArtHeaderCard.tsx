import { useState, useEffect, useRef } from "react";
import { View, Keyboard, Dimensions, Animated } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { Circle } from "~/lib/icons/Circle";
import { Sparkles } from "~/lib/icons/Magic";
import { Separator } from "~/components/ui/separator";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";

export default function ArtHeaderCard({ imageString, generationCount }: { imageString: string, generationCount: number }) {
  const screenWidth = Dimensions.get('window').width;
  const initialSize = screenWidth * 0.8;
  const shrinkSize = screenWidth * 0.4;
  const [imageSize] = useState(new Animated.Value(initialSize));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        Animated.timing(imageSize, {
          toValue: shrinkSize,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        Animated.timing(imageSize, {
          toValue: initialSize,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [imageSize, shrinkSize, initialSize]);

  return (
    <Card className='m-2 bg-popover shadow-none'>
      <CardContent className='py-2 px-2 gap-2'>
        {!imageString && <>
          <View className='flex-row gap-4 items-center'>
            <Sparkles className='color-primary mt-1 ml-1' />
            <P className='flex-1 text-left font-bold'>
              Here you can use OpenAI's Dalle to generate a cover art for your playlist. You get 3 free generations per day.
            </P>
          </View>
          <Separator />
          <View className='flex-col gap-2 ml-2'>
            <View className="flex-row gap-4 items-center">
              <Circle size={10} className='color-primary' />
              <P className='flex-1 text-left'>Click "Generate for me" to automatically create a cover based on the artists in the playlist.</P>
            </View>
            <View className="flex-row gap-4 items-center">
              <Circle size={10} className='color-primary' />
              <P className='flex-1 text-left'>Or use the textbox to use a custom prompt for the generated cover.</P>
            </View>
          </View>
        </>}
        {imageString &&
          <Animated.View style={{ width: imageSize, height: imageSize, borderRadius: 6, alignSelf: 'center' }}>
            <Image
              source={{ uri: imageString }}
              style={{ width: '100%', height: '100%', borderRadius: 6 }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </Animated.View>}
        {imageString && generationCount > 0 && 
          <P className='text-center text-xs'>You have {3-generationCount} generations left today.</P>
        }
      </CardContent>
    </Card>
  );
}
