import { Stack } from "expo-router";

import "../global.css";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerTitle: "",
            headerShadowVisible: false,
            headerBackTitle: "Go Back",
            animation: "fade",
            // headerBackVisible: false,
            // contentStyle: { backgroundColor: "white" },
          }}
        >
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="(app)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          {/* <Stack.Screen name="auth" options={{ headerShown: true }} /> */}
          {/* <Stack.Screen name="index" /> */}
        </Stack>
      </AuthProvider>
    </OnboardingProvider>
  );
}
