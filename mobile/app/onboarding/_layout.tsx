import { useOnboarding } from "@/context/OnboardingContext";
import { Redirect, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function OnBoardingLayout() {
  const { onboardingCompleted } = useOnboarding();

  if (onboardingCompleted) {
    return <Redirect href="/auth/signin" />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // contentStyle: { backgroundColor: "white" },
        // animation: "fade",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen3"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
