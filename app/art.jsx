import { useLocalSearchParams } from "expo-router";
import { View, Keyboard, TouchableWithoutFeedback, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Textarea } from '~/components/ui/textarea';
import ArtHeaderCard from "~/components/cards/ArtHeaderCard";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Save } from "~/lib/icons/Save";
import { Sparkles } from "~/lib/icons/Magic";
import { useArtGenerator } from "~/hooks/useArtGenerator";  // Import the hook

export default function CoverArtGenerator() {
  const { playlistId, artists } = useLocalSearchParams();
  const {
    customPrompt,
    setCustomPrompt,
    imageString,
    loading,
    generationCount,
    generateCoverArt,
    generateForMe,
    saveToSpotify,
    MAX_GENERATIONS,
  } = useArtGenerator(artists, playlistId);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="flex-1">
          <ArtHeaderCard imageString={imageString} generationCount={generationCount} />
          <View className="flex-1 flex-col mx-2 gap-2 justify-between">
            {!loading && imageString &&
              <Button className="flex-row gap-2 bg-destructive" onPress={saveToSpotify}>
                <Save className="color-foreground" />
                <Text className="text-foreground">Save to Spotify</Text>
              </Button>
            }
            <View />
            <View className="gap-2 mb-12">
              <Textarea
                style={{ height: 75 }}
                numberOfLines={4}
                placeholder={generationCount >= MAX_GENERATIONS ? 'Out of generations for today.' : 'Custom prompt...'}
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
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}