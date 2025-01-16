import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View>
        <Text style={{ color: theme.colors.inverseSurface }}>Home</Text>
      </View>
    </SafeAreaView>
  );
}
