import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import '../global.css';
import { OnboardingProvider } from '@/context/OnboardingContext';
// import { AuthProvider } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthNewContext';
import { QueryClientProvider } from '@tanstack/react-query';

import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <AuthProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              headerTitle: '',
              headerShadowVisible: false,
              headerBackTitle: 'Go Back',
              animation: 'fade',
              headerBackVisible: false,
              // contentStyle: { backgroundColor: "white" },
              headerStyle: {
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              },
              headerTintColor: isDark ? '#FFFFFF' : '#000000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {/* <Stack.Screen name="(protected)/(tabs)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(protected)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            {/* <Stack.Screen name="auth" options={{ headerShown: true }} /> */}
            {/* <Stack.Screen name="index" /> */}
          </Stack>
        </AuthProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}
