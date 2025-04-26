import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/AuthNewContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { Redirect, Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)', // anchor
};

export default function ProtectedLayout() {
  const { onboardingCompleted } = useOnboarding();
  const { isAuthenticated, logout, getAccessToken, getRefreshToken } =
    useAuth();

  if (!getAccessToken() || !getRefreshToken()) {
    logout();
    return <Redirect href="/auth/signin" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/signin" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="groups"
        options={{
          headerShown: false,
        }}
      /> */}

      {/* <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="modal-with-stack"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      /> */}
    </Stack>
  );
}
