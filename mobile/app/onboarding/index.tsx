import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function IndexPage() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Onboarding Index Screen</Text>
      <Button
        title="Go to Screen 2"
        onPress={() => {
          // Navigate to the next screen
          router.push("/onboarding/screen2");
        }}
      />
    </View>
  );
}
