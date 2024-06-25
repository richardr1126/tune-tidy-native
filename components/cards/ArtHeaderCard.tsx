import { View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { Circle } from "~/lib/icons/Circle";
import { Sparkles } from "~/lib/icons/Magic";
import { Separator } from "~/components/ui/separator";
import { Image } from "expo-image";
import { blurhash } from "~/lib/utils";

export default function ArtHeaderCard({ imageString }: { imageString: string }) {
  return (
    <Card className='m-2 bg-popover shadow-none'>
      <CardContent className='py-2 px-2 gap-2'>
        {!imageString && <>
          <View className='flex-row gap-4 items-center'>
            <Sparkles className='color-primary mt-1 ml-1' />
            <P className='flex-1 text-left font-bold'>
              Here you can use OpenAI's Dalle 2/3 to generate a cover art for your playlist. You get 3 free generations per day.
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
          <Image
            source={{ uri: imageString }}
            style={{ width: 150, height: 150, borderRadius: 6, alignSelf: 'center' }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />}
      </CardContent>
    </Card>
  );
}