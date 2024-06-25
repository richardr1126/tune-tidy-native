import { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import * as Haptics from 'expo-haptics';
import { useQueryClient } from "@tanstack/react-query";
import { storeData, getData, clear } from "~/utils/asyncStorage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "~/contexts/UserContext";

const MAX_GENERATIONS = 3;

export const useArtGenerator = (artists, playlistId) => {
  const { spotify } = useUser();
  const [customPrompt, setCustomPrompt] = useState("");
  const [imageString, setImageString] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    //clear();
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
    Keyboard.dismiss();

    const model = await getData('selectedModel');
    console.log('model', model);

    fetch('https://generate-image-h2ovhy5mbq-uc.a.run.app', {
      method: 'POST',
      body: JSON.stringify({ prompt: prompt, model: model}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.text())
      .then(data => {
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
    Keyboard.dismiss();

    fetch('https://generate-prompt-h2ovhy5mbq-uc.a.run.app', {
      method: 'POST',
      body: JSON.stringify({ artists: artists }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
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
      Haptics.selectionAsync();
      Keyboard.dismiss();

      await spotify.uploadCustomPlaylistCoverImage(playlistId, imageString);
      setLoading(false);

      router.back();
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    } catch (error) {
      console.error('Error saving image to Spotify:', error);
      setLoading(false);
    }
  };

  return {
    customPrompt,
    setCustomPrompt,
    imageString,
    loading,
    generationCount,
    generateCoverArt,
    generateForMe,
    saveToSpotify,
    MAX_GENERATIONS,
  };
};