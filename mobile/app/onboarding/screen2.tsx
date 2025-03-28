import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Screen2() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Onboarding Screen2</Text>

      <Button
        title="Go to Screen 3"
        onPress={() => {
          // Navigate to the next screen
          router.push("/onboarding/screen3");
        }}
      />
    </View>
  );
}
