import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function GroupsLayout() {
  const colorScheme = useColorScheme();

  // return <Stack />;
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Groups',
        }}
      />

      <Stack.Screen
        name="search"
        options={{
          // title: 'Search Groups',
          headerBackVisible: false, // force show back button
          headerShown: false,
          // animation: 'slide_from_bottom_fade', // reveal from bottom to top with fade
          // animation: 'slide_from_bottom', // reveal from bottom to top with fade
          // animationDuration: 150,
          animation: 'fade', // fade animation
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          headerBackVisible: true, // force show back button
          headerShown: true,
          title: 'Create Group',
          animation: 'fade', // fade animation
        }}
      />
    </Stack>
  );

  // return (
  //   <Stack
  //     screenOptions={{
  //       // headerShown: true,
  //       // headerTitle: 'Groups',
  //       headerShadowVisible: false,
  //       headerBackTitle: 'Go Back',
  //       animation: 'fade',
  //       headerBackVisible: true,
  //       // contentStyle: { backgroundColor: "white" },
  //       headerStyle: {
  //         backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
  //       },
  //       headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  //       headerTitleStyle: {
  //         fontWeight: 'bold',
  //       },
  //     }}
  //   >
  //     <Stack.Screen
  //       name="index"
  //       options={{
  //         title: 'Groups',
  //         headerStyle: {
  //           backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
  //         },
  //         headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  //         headerTitleStyle: {
  //           fontWeight: 'bold',
  //         },
  //       }}
  //     />
  //     <Stack.Screen
  //       name="create"
  //       options={{
  //         title: 'Create Group',
  //         headerShadowVisible: false,
  //         headerBackTitle: 'Go Back',
  //         animation: 'fade',
  //         headerBackVisible: true,
  //         // contentStyle: { backgroundColor: "white" },
  //         headerStyle: {
  //           backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
  //         },
  //         headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
  //         headerTitleStyle: {
  //           fontWeight: 'bold',
  //         },
  //       }}
  //     />
  //   </Stack>
  // );
}
