import { Slot, SplashScreen, Stack } from 'expo-router';
import { SessionProvider } from '@mobile/state/context';
import TrpcProvider from '@mobile/components/TrpcProvider';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <TrpcProvider>
        <PaperProvider>
          {/* <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack> */}

          {/* <StatusBar style="auto" /> */}

          <Slot />
        </PaperProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}

// <SessionProvider>
//   <TrpcProvider>
//     {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
//     <PaperProvider>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </PaperProvider>
//     {/* </ThemeProvider> */}
//   </TrpcProvider>
// </SessionProvider>
