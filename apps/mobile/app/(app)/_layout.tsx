import { Text } from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';

import { SessionProvider, useSession } from '@mobile/state/context';
import TrpcProvider from '@mobile/components/TrpcProvider';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    // return <Redirect href="/sign-in" />;
    return <Redirect href="/(auth)/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  // return <Stack />;

  return (
    <React.Fragment>
      {/* <StatusBar style="auto" /> */}

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </React.Fragment>
  );
}
