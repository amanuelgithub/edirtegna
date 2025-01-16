import { View, Text } from 'react-native';
import React from 'react';
import { useSession } from '@mobile/state/context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

export default function Settings() {
  const { signOut } = useSession();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View>
        <Text
          style={{ color: theme.colors.inverseSurface }}
          onPress={() => {
            // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
            signOut();
          }}
        >
          Sign Out
        </Text>
      </View>
    </SafeAreaView>
  );
}
