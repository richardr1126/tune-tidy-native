import { View } from "react-native";
import ModelSelector from "~/components/ModelSelector";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUser } from "~/contexts/UserContext";

import { Sparkles } from "~/lib/icons/Magic";
import { useColorScheme } from "~/lib/useColorScheme";

export default function Settings() {
  const { isDarkColorScheme } = useColorScheme();
  const { logout } = useUser();


  return (
    <View className="flex-1 justify-between">
      <View>
        <View className="gap-2">
          <View className="px-3 py-1.5 bg-card border-b border-t border-border flex-row items-center justify-between">
            <Text className="font-bold">Theme</Text>
            <ThemeToggle />
          </View>
          <View className="px-3 py-1.5 bg-card border-b border-t border-border flex-row items-center justify-between">
            <Text className="font-bold">Cover art generation model</Text>
            <ModelSelector />
          </View>
        </View>
      </View>
      <View className="px-2 py-2">
        <Button onPress={logout}>
          <Text>Logout</Text>
        </Button>
      </View>
    </View>
  );
}