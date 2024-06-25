import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Textarea } from '~/components/ui/textarea';
import ArtHeaderCard from "~/components/cards/ArtHeaderCard";
import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUser } from "~/contexts/UserContext";
import { Save } from "~/lib/icons/Save";
import { Sparkles } from "~/lib/icons/Magic";
import * as Haptics from 'expo-haptics';
import { useQueryClient } from "@tanstack/react-query";
import { storeData, getData } from "~/utils/asyncStorage";

const MAX_GENERATIONS = 3;

export default function CoverArtGenerator() {
  const { playlistId, artists } = useLocalSearchParams();
  const { spotify } = useUser();
  const inputRef = useRef();
  const [customPrompt, setCustomPrompt] = useState("");
  const [imageString, setImageString] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAndResetGenerationCountIfNeeded = async () => {
      const storedDate = await getData('generationDate');
      const currentDate = new Date().toISOString().split('T')[0];

      if (storedDate !== currentDate) {
        await storeData('generationDate', currentDate);
        await storeData('generationCount', '0');
        setGenerationCount(0);
      } else {
        const count = await getData('generationCount');
        setGenerationCount(parseInt(count, 10) || 0);
      }
    };
    fetchAndResetGenerationCountIfNeeded();
  }, []);

  const updateGenerationCount = async () => {
    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    await storeData('generationCount', newCount.toString());
  };

  const generateCoverArt = async (prompt = customPrompt) => {
    if (generationCount >= MAX_GENERATIONS) return;

    setLoading(true);
    Haptics.selectionAsync();

    fetch('https://generate-image-h2ovhy5mbq-uc.a.run.app', {
      method: 'POST',
      body: JSON.stringify({ prompt: prompt }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.text())
      .then(data => {
        console.log('Image generated');
        setImageString(`data:image/jpeg;base64,${data}`);
        setLoading(false);
        updateGenerationCount();
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const generateForMe = async () => {
    if (generationCount >= MAX_GENERATIONS) return;

    setLoading(true);
    Haptics.selectionAsync();

    fetch('https://generate-prompt-h2ovhy5mbq-uc.a.run.app', {
      method: 'POST',
      body: JSON.stringify({ artists: artists }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Prompt generated');
        setCustomPrompt(data.prompt);
        generateCoverArt(data.prompt);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const saveToSpotify = async () => {
    try {
      setLoading(true);
      await spotify.uploadCustomPlaylistCoverImage(playlistId, imageString); // base64 image string
      setLoading(false);
      console.log('Image saved to Spotify');
      router.back();
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    } catch (error) {
      console.error('Error saving image to Spotify:', error);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1">
        <ArtHeaderCard imageString={imageString} />
        <View className="flex-1 flex-col mx-2 gap-2">
          <Textarea
            ref={inputRef}
            style={{ height: 100 }}
            numberOfLines={4}
            placeholder={generationCount >= MAX_GENERATIONS ? 'Out of generations for today.':'Custom prompt...'}
            editable={generationCount < MAX_GENERATIONS}
            value={customPrompt}
            onChangeText={setCustomPrompt}
            aria-labelledby='textareaLabel'
          />
          <Button className="bg-muted" disabled={customPrompt.length === 0 || loading || generationCount >= MAX_GENERATIONS} onPress={() => generateCoverArt(customPrompt)}>
            {!loading && <Text className="text-foreground">Generate using custom prompt</Text>}
            {loading && <ActivityIndicator size="small" className="color-foreground" />}
          </Button>
          <Button onPress={generateForMe} disabled={loading || generationCount >= MAX_GENERATIONS}>
            {!loading &&
              <View className="flex-row gap-2 items-center">
                <Sparkles className="color-muted" />
                <Text>Generate for me</Text>
              </View>
            }
            {loading && <ActivityIndicator size="small" className="color-foreground" />}
          </Button>
          {!loading && imageString && 
            <Button className="flex-row gap-2 bg-destructive mt-10" onPress={saveToSpotify}>
              <Save className="color-foreground" />
              <Text className="text-foreground">Save to Spotify</Text>
            </Button>
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
