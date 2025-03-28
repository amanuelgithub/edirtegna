import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Screen3() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Onboarding Screen3</Text>
      <Text>Complete Onboarding!</Text>

      <Button
        title="Go to Home"
        onPress={() => {
          // Complete the onboarding process
          completeOnboarding();
          // Navigate to the home screen
          router.push("/auth");
        }}
      />
    </View>
  );
}
