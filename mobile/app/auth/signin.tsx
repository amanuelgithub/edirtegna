import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const { onboardingCompleted, completeOnboarding } = useOnboarding();
  const { login } = useAuth();

  return (
    <View>
      <Text>signin</Text>
      <Text>{"is onobarding completed: " + onboardingCompleted}</Text>

      <Button
        title="Login"
        onPress={() => {
          // Perform login logic here
          login();
          // Navigate to the home screen
          router.push("/(app)");
        }}
      />
    </View>
  );
}
