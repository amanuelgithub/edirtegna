import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, Button } from "react-native";

export default function Home() {
  const router = useRouter();
  const { completeOnboarding, onboardingCompleted } = useOnboarding();
  const { logout } = useAuth();

  useEffect(() => {
    // Check if onboarding is completed
    if (onboardingCompleted) {
      // Navigate to the home screen
      router.push("/(app)");
    }
    // If onboarding is not completed, redirect to the onboarding screen
    else {
      router.push("/onboarding");
    }
  }, [completeOnboarding, onboardingCompleted]);

  // Check if onboarding is completed
  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View>
      <Text>Home</Text>

      <Button
        title="Reset Onboarding"
        onPress={() => {
          // Reset the onboarding process
          completeOnboarding("false");
          // Logout the user
          logout();

          // Navigate to the home screen
          // router.push("/onboarding/screen2");
        }}
      />
    </View>
  );
}
