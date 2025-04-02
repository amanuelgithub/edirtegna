// import { useAuth } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthNewContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { onboardingCompleted } = useOnboarding();
  const { isAuthenticated } = useAuth();

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // contentStyle: { backgroundColor: "white" },
        // animation: "fade",
      }}
    >
      {/* <Stack.Screen name="index" />
      <Stack.Screen name="signin" options={{ headerShown: true }} />
      <Stack.Screen name="signup" options={{ headerShown: true }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: true }} />
      <Stack.Screen name="verify-otp" options={{ headerShown: true }} /> */}

      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="set-password" />
    </Stack>
  );
}
